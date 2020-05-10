const NetworkEvents = require('./network-events'),
      Request       = require('./request'),
      Response      = require('./response');

module.exports.ENTITIES = {
    [NetworkEvents.REQUEST_WILL_SEND]: {
        Entity  : Request,
        method  : NetworkEvents.REQUEST_WILL_SEND,
        selector: function (item) {
            return item.message.params.request.url;
        }
    },

    [NetworkEvents.RESPONSE_DID_RECEIVE]: {
        Entity  : Response,
        method  : NetworkEvents.RESPONSE_DID_RECEIVE,
        selector: function (item) {
            return item.message.params.response.url;
        }
    }
};
