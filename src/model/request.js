/**
 * @param {Array} list requests, where entity should include 'request' property
 * @param {Function} listToResults
 * @constructor
 */
function Request(list, listToResults) {
    return listToResults(list, 'executed', parametersToObject);
}

function parametersToObject(params) {
    let request;

    if (params) {
        request = params.request;

        return {
            headers : request.headers,
            method  : request.method,
            postData: request.postData,
            url     : request.url
        }
    }
}

module.exports = Request;
