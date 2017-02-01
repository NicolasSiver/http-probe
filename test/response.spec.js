const expect = require('chai').expect,
      sinon  = require('sinon');

let HttpProbe = require('../src/index');

describe('Response', () => {

    let httpProbe;

    beforeEach(() => {
        httpProbe = new HttpProbe(() => snapshotPolymer);
    });

    it('registers all responses', () => {
        expect(httpProbe.getResponse('www.polymer-project.org').length).to.be.equal(33);
    });

    it('finds by regular expression', () => {
        expect(httpProbe.getResponse(/project.*highlight.js/).length).to.be.equal(1);
    });

    it('finds by partial string', () => {
        expect(httpProbe.getResponse('elements.html').length).to.be.equal(1);
    });

    it('registers a response', () => {
        expect(httpProbe.getResponse('logos').received).to.be.true;
    });

    it('registers single response', () => {
        expect(httpProbe.getResponse('feature-speed.png').receivedOnce).to.be.true;
    });

    it('registers two responses', () => {
        expect(httpProbe.getResponse('youtube.com/embed').receivedTwice).to.be.true;
    });

    it('registers three responses', () => {
        expect(httpProbe.getResponse('feature').receivedThrice).to.be.true;
    });

    it('provides the first response', () => {
        let response = httpProbe.getResponse('feature-speed.png');
        expect(response.first).to.be.deep.equal(response.last);
    });

    it('provides the second response', () => {
        let response = httpProbe.getResponse('youtube.com/embed');
        expect(response.second).to.be.deep.equal(response.last);
    });

    it('provides the third response', () => {
        let response = httpProbe.getResponse('feature');
        expect(response.third).to.be.deep.equal(response.last);
    });

    it('includes data length', () => {
        expect(httpProbe.getResponse('feature').first.encodedDataLength).to.be.equal(49);
    });

    it('includes disk cache', () => {
        expect(httpProbe.getResponse('feature').first.fromDiskCache).to.be.false;
    });

    it('includes service worker', () => {
        expect(httpProbe.getResponse('feature').first.fromServiceWorker).to.be.false;
    });

    it('includes headers', () => {
        expect(httpProbe.getResponse('feature').first.headers).to.have.all.keys(
            'age', 'cache-control', 'content-length', 'content-type', 'date', 'etag',
            'expires', 'server', 'status', 'x-cloud-trace-context'
        );
    });

    it('includes request headers', () => {
        expect(httpProbe.getResponse('feature').first.requestHeaders).to.be.undefined;
    });

    it('includes status', () => {
        expect(httpProbe.getResponse('feature').first.status).to.be.equal(200);
    });

    it('includes status text', () => {
        expect(httpProbe.getResponse('feature').first.statusText).to.be.equal('');
    });

    it('includes url', () => {
        expect(httpProbe.getResponse('feature').first.url).to.be.equal('https://www.polymer-project.org/images/page-index/feature-components.png');
    });

});
