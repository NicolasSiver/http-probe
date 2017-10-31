/**
 * Small tool for the Performance logs snapshots.
 * Environment parameters: URL, example: URL=https://www.amazon.com/ node create-snapshot.js
 */
const chromeRemoteInterface = require('chrome-remote-interface'),
      fs                    = require('fs'),
      url                   = require('url');

let performanceLogs = [];

chromeRemoteInterface(client => {
    const {Network, Target, Page} = client;
    var targetId = null;

    Network.requestWillBeSent(params => {
        addLog('Network.requestWillBeSent', params, targetId);
    });

    Network.responseReceived(params => {
        addLog('Network.responseReceived', params, targetId);
    });

    Promise.all([
        Network.enable(), Page.enable()
    ]).then(() => {
        return Target.createTarget({url: process.env.URL});
    }).then(target => {
        console.log('Target ID: ' + target.targetId);
        targetId = target.targetId;
        return Page.navigate({url: process.env.URL});
    }).then(() => {
        return new Promise(resolve => {
            console.log('Start recording, 30 seconds.');
            setTimeout(() => {
                flushSnapshot(performanceLogs);
                client.close();
                resolve();
            }, 30000);
        });
    }).catch(error => {
        console.error('Error did occur: ' + error);
        client.close();
    });

}).on('error', error => {
    console.error('Cannot connect to remote endpoint:', error);
});

function addLog(method, params, targetId) {
    performanceLogs.push({
        message: {method, params},
        webview: targetId
    });
}

function flushSnapshot(logs) {
    let filename = url.parse(process.env.URL).hostname.replace(/\./g, '-') + '.snapshot';
    fs.writeFile(filename, JSON.stringify(logs), 'utf8', () => {
        console.log(`File ${filename} is successfully saved.`);
    });
}
