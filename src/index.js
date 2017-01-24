/**
 * Network domain allows tracking network activities of the page. It exposes information about http requests and responses,
 * their headers, bodies, timing, etc.
 *
 * @param {function} getLogMessages should return a collection of log messages. Every log message should comply with the Chrome debugging protocol
 * @constructor
 */
function HttpProbe(getLogMessages) {
    this.getLogMessages = getLogMessages;
}

HttpProbe.prototype.getRequest = function (search) {

};

HttpProbe.prototype.getResponse = function (search) {

};

module.exports = HttpProbe;
