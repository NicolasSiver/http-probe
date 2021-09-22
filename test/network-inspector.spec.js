const EventEmitter = require('events'),
      expect       = require('chai').expect;

let NetworkEvents      = require('../src/model/network-events'),
    {NetworkInspector} = require('../src/index');

describe('Network Inspector', () => {

    let emitter, inspector;

    beforeEach(() => {
        emitter = new EventEmitter();
        inspector = new NetworkInspector(emitter);
    });

    it('listens for network requests', () => {
        emitter.emit(NetworkEvents.REQUEST_WILL_SEND);
        emitter.emit(NetworkEvents.REQUEST_WILL_SEND);
        emitter.emit(NetworkEvents.REQUEST_WILL_SEND);

        expect(inspector.getLogs()).to.be.lengthOf(3);
    });

    it('listens for network responses', () => {
        emitter.emit(NetworkEvents.RESPONSE_DID_RECEIVE);
        emitter.emit(NetworkEvents.RESPONSE_DID_RECEIVE);
        emitter.emit(NetworkEvents.RESPONSE_DID_RECEIVE);

        expect(inspector.getLogs()).to.be.lengthOf(3);
    });

    it('ignores other events', () => {
        emitter.emit('HelloWorld');
        emitter.emit('FakeEvent');
        emitter.emit('init');
        emitter.emit('complete');
        emitter.emit('start');

        expect(inspector.getLogs()).to.be.lengthOf(0);
    });

    it('depletes logs', () => {
        emitter.emit(NetworkEvents.RESPONSE_DID_RECEIVE);
        inspector.getLogs();

        expect(inspector.getLogs()).to.be.lengthOf(0);
    });

    it('preservers logs', () => {
        emitter.emit(NetworkEvents.RESPONSE_DID_RECEIVE);
        emitter.emit(NetworkEvents.RESPONSE_DID_RECEIVE);
        inspector.getLogs(false);

        expect(inspector.getLogs()).to.be.lengthOf(2);
    });

    it('releases resources', () => {
        emitter.emit(NetworkEvents.RESPONSE_DID_RECEIVE);
        inspector.dispose();
        emitter.emit(NetworkEvents.RESPONSE_DID_RECEIVE);

        expect(inspector.getLogs()).to.be.lengthOf(0);
    });

    it('formats log messages for debugging protocol', () => {
        emitter.emit(NetworkEvents.RESPONSE_DID_RECEIVE, {my: 'payload8'});

        expect(inspector.getLogs()).to.be.deep.equal([
            {
                message: {method: NetworkEvents.RESPONSE_DID_RECEIVE, params: {my: 'payload8'}},
                webview: null
            }
        ]);
    });

});
