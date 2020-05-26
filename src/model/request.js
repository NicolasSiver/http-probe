const queryString = require('querystring');

const {isJsonCollection} = require('../util/is-json-collection');

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
            postData: isJsonCollection(request.postData) ? JSON.parse(request.postData) : queryString.parse(request.postData),
            url     : request.url
        }
    }
}

module.exports = Request;
