/**
 * @param {Array} list
 * @param {Function} listToResults
 * @constructor
 */
function Response(list, listToResults) {
    return listToResults(list, 'received', parametersToObject);
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
