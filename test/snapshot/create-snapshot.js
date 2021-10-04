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
    let resourceVisits;
    let targetId = null;
    let resources = process.env.URL.split(' ');

    Network.requestWillBeSent(params => {
        addLog('Network.requestWillBeSent', params, targetId);
    });

    Network.responseReceived(params => {
        addLog('Network.responseReceived', params, targetId);
    });

    resourceVisits = resources.reduce((chain, resource) => {
        return chain.then(() => {
            return Target.createTarget({url: resource});
        }).then(target => {
            console.log('Target ID: ' + target.targetId + ', URL: ' + resource);
            targetId = target.targetId;
            return Page.navigate({url: resource});
        }).then(() => {
            return new Promise(resolve => {
                console.log('Start recording, 8 seconds.');
                setTimeout(() => resolve(), 8000);
            });
        });
    }, Promise.resolve());

    Promise
        .all([
            Network.enable(), Page.enable()
        ])
        .then(() => resourceVisits)
        .then(() => flushSnapshot(performanceLogs))
        .then(() => client.close())
        .catch(error => {
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
