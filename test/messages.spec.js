const expect = require('chai').expect,
      sinon  = require('sinon');

let HttpProbe = require('../src/index');

describe('Messages', () => {

    it('invokes messages for the response', () => {
        let messages = sinon.spy(), myProbe = new HttpProbe(messages);
        myProbe.getResponse('');
        expect(messages.called).to.be.true;
    });

    it('invokes messages for the request', () => {
        let messages = sinon.spy(), myProbe = new HttpProbe(messages);
        myProbe.getRequest('');
        expect(messages.called).to.be.true;
    });

    it('gets all messages by a method', () => {
        let probe = new HttpProbe(() => snapshotPlaystation);
        expect(probe.getMessagesByMethod('Network.requestWillBeSent', snapshotPlaystation).length).to.be.equal(107);
        expect(probe.getMessagesByMethod('Network.responseReceived', snapshotPlaystation).length).to.be.equal(100);
    });

});
