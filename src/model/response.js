/**
 * @param {Array} list
 * @constructor
 */
function Response(list) {
    this.length = list.length;
    this.received = this.length > 0;
    this.receivedOnce = this.length == 1;
    this.receivedTwice = this.length == 2;
    this.receivedThrice = this.length == 3;
    this.first = parametersToObject(list[0]);
    this.second = parametersToObject(list[1]);
    this.third = parametersToObject(list[2]);
    this.last = parametersToObject(list[list.length - 1]);
}

function parametersToObject(params) {
    var response;

    if (params) {
        response = params.response;
        return {
            encodedDataLength: response.encodedDataLength,
            fromDiskCache    : response.fromDiskCache,
            fromServiceWorker: response.fromServiceWorker,
            headers          : response.headers,
            requestHeaders   : response.requestHeaders,
            status           : response.status,
            statusText       : response.statusText,
            url              : response.url
        }
    }
}

module.exports = Response;
