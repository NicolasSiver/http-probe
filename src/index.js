var listToResults = require('./util/list-to-results'),
    NetworkEvents = require('./model/network-events'),
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

HttpProbe.prototype.getEntity = function (search, Entity, method, selector) {
    // Extract latest messages
    this.addMessages(this.getLogMessages());
    return new Entity(
        this.getParametersBySearch(search, this.getMessagesByMethod(method, this.rawLogs), selector),
        listToResults
    );
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
    return this.getEntity(search, Request, NetworkEvents.REQUEST_WILL_SEND, function (item) {
        return item.message.params.request.url;
    });
};

HttpProbe.prototype.getResponse = function (search) {
    return this.getEntity(search, Response, NetworkEvents.RESPONSE_DID_RECEIVE, function (item) {
        return item.message.params.response.url;
    });
};

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

module.exports = HttpProbe;
