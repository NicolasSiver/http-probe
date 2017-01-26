/**
 *
 * @param {Array} list requests, where entity should include 'request' property
 * @constructor
 */
function Request(list) {
    this.length = list.length;
    this.executed = this.length > 0;
    this.executedOnce = this.length == 1;
    this.executedTwice = this.length == 2;
    this.executedThrice = this.length == 3;
    this.first = parametersToObject(list[0]);
    this.second = parametersToObject(list[1]);
    this.third = parametersToObject(list[2]);
    this.last = parametersToObject(list[list.length - 1]);
}

function parametersToObject(params) {
    if (params) {
        return {
            headers: params.request.headers,
            method : params.request.method,
            url    : params.request.url
        }
    }
}

module.exports = Request;
