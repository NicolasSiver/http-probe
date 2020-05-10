const NetworkEvents = require('./model/network-events');

class NetworkInspector {

    /**
     * Captures network events through Chrome debugging protocol for the later use in HttpProbe for analysis.
     *
     * @param {Object} target entity that implements EventEmitter interface
     */
    constructor(target) {
        this.target = target;
        this.networkLogs = [];
        this.requestListener = payload => this.addLogMessage(NetworkEvents.REQUEST_WILL_SEND, payload);
        this.responseListener = payload => this.addLogMessage(NetworkEvents.RESPONSE_DID_RECEIVE, payload);

        this.target.on(NetworkEvents.REQUEST_WILL_SEND, this.requestListener);
        this.target.on(NetworkEvents.RESPONSE_DID_RECEIVE, this.responseListener);
    }

    addLogMessage(method, params) {
        this.networkLogs.push({
            message: {method, params},
            webview: null
        })
    }

    dispose() {
        if (this.target !== null) {
            this.target.removeListener(NetworkEvents.REQUEST_WILL_SEND, this.requestListener);
            this.target.removeListener(NetworkEvents.RESPONSE_DID_RECEIVE, this.responseListener);
            this.target = null;
        }
    }

    /**
     * Get the latest network logs. By default behavior is aligned with Performance Logs.
     * Every time when logs have requested the list of recorded network request will reset.
     * It's possible to preserve logs by changing behavior for the depletion.
     *
     * @param {boolean} deplete provide "false" if network logs should be preserved between log requests
     * @returns {Array} list of the network logs
     */
    getLogs(deplete = true) {
        let result = this.networkLogs.slice();

        if (deplete === true) {
            this.networkLogs.length = 0;
        }

        return result;
    }

}

module.exports = {NetworkInspector};
