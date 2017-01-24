var NetworkEvents = require('./model/network-events'),
    Request       = require('./model/request'),
    Response      = require('./model/response');

/**
 * Network domain allows tracking network activities of the page. It exposes information about http requests and responses,
 * their headers, bodies, timing, etc.
 *
 * @param {function} getLogMessages should return a collection of log messages. Every log message should comply with the Chrome debugging protocol
 * @constructor
 */
function HttpProbe(getLogMessages) {
    this.getLogMessages = getLogMessages;
    this.rawLogs = [];
}

HttpProbe.prototype.addMessages = function (messages) {
    if (messages) {
        this.rawLogs = this.rawLogs.concat(messages.map(function (logMessage) {
            if (logMessage.hasOwnProperty('message') && isString(logMessage['message'])) {
                return JSON.parse(logMessage['message']);
            } else {
                return logMessage;
            }
        }));
    }
};

HttpProbe.prototype.getMessagesByMethod = function (method, messages) {
    return messages.filter(function (logMessage) {
        return logMessage.message.method === method;
    });
};

HttpProbe.prototype.getParametersBySearch = function (search, messages, selector) {
    var result = [], value;
    messages.forEach(function (logMessage) {
        value = selector(logMessage);

        if ((isString(search) && value.indexOf(search) != -1)
            || ((search instanceof RegExp) && search.test(value))) {
            result.push(logMessage.message.params);
        }
    });
    return result;
};

HttpProbe.prototype.getRequest = function (search) {
    this.addMessages(this.getLogMessages());
    return new Request(this.getParametersBySearch(
        search, this.getMessagesByMethod(NetworkEvents.REQUEST_WILL_SEND, this.rawLogs),
        function (item) {
            return item.message.params.request.url;
        })
    );
};

HttpProbe.prototype.getResponse = function (search) {
    this.addMessages(this.getLogMessages());
    return new Response(this.getParametersBySearch(
        search, this.getMessagesByMethod(NetworkEvents.RESPONSE_DID_RECEIVE, this.rawLogs),
        function (item) {
            return item.message.params.response.url;
        })
    );
};

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

module.exports = HttpProbe;
