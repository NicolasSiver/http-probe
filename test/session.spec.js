const expect = require('chai').expect;

let {HttpProbe} = require('../src/index');

describe('Session', () => {

    let httpProbe;

    beforeEach(() => {
        httpProbe = new HttpProbe(() => snapshotGoogle);
    });

    it('skips initial session', () => {
        expect(httpProbe.getRequest('images/nav_logo242.png').executed).to.be.false;
    });

    it('skips second session', () => {
        expect(httpProbe.getRequest('rsrc.php').executed).to.be.false;
    });

    it('registers request for last session only', () => {
        expect(httpProbe.getRequest('AmazonUIBaseCSS').length).to.be.equal(3);
    });

    it('registers response for last session only', () => {
        expect(httpProbe.getResponse('AmazonGateway').length).to.be.equal(4);
    });

});
