const {ENTITIES}      = require('./model/entities'),
      {isString}      = require('./util/is-string'),
      {listToResults} = require('./util/list-to-results'),
      NetworkEvents   = require('./model/network-events');

class HttpProbe {

    /**
     * Network domain allows tracking network activities of the page. It exposes information about http requests and responses,
     * their headers, bodies, timing, etc.
     *
     * @param {function} getLogMessages should return a collection of log messages. Every log message should comply with the Chrome debugging protocol
     * @constructor
     */
    constructor(getLogMessages) {
        this.getLogMessages = getLogMessages;
        this.rawLogs = [];
        this.webViewId = null;
    }

    addMessages(messages) {
        let i, len, message, parsedMessages;

        if (messages) {
            parsedMessages = messages.map(function (logMessage) {
                if (logMessage.hasOwnProperty('message') && isString(logMessage['message'])) {
                    return JSON.parse(logMessage['message']);
                } else {
                    return logMessage;
                }
            });

            // Store messages only for the last session/web-view
            for (i = 0, len = parsedMessages.length; i < len; ++i) {
                message = parsedMessages[i];

                if (this.webViewId !== message.webview) {
                    this.webViewId = message.webview;
                    this.rawLogs.length = 0;
                }

                this.rawLogs.push(message);
            }
        }
    }

    getEntity(search, entityMeta) {
        let {Entity, method, selector} = entityMeta;

        // Extract latest messages
        this.addMessages(this.getLogMessages());

        return new Entity(
            this.getParametersBySearch(search, this.getMessagesByMethod(method, this.rawLogs), selector),
            listToResults
        );
    }

    getMessagesByMethod(method, messages) {
        return messages.filter(function (logMessage) {
            return logMessage.message.method === method;
        });
    }

    getParametersBySearch(search, messages, selector) {
        let value;
        let result = [];

        messages.forEach(logMessage => {
            value = selector(logMessage);

            if ((isString(search) && value.indexOf(search) !== -1) ||
                ((search instanceof RegExp) && search.test(value))) {
                result.push(logMessage.message.params);
            }
        });

        return result;
    }

    getRequest(search) {
        return this.getEntity(search, ENTITIES[NetworkEvents.REQUEST_WILL_SEND]);
    }

    getResponse(search) {
        return this.getEntity(search, ENTITIES[NetworkEvents.RESPONSE_DID_RECEIVE]);
    }
}

module.exports = {HttpProbe};
