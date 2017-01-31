const expect = require('chai').expect,
      sinon  = require('sinon');

let HttpProbe = require('../src/index');

describe('Request', () => {

    let httpProbe;

    beforeEach(() => {
        httpProbe = new HttpProbe(() => snapshotAmazon);
    });

    it('registers all requests', () => {
        expect(httpProbe.getRequest('images-na').length).to.be.equal(72);
    });

    it('finds by regular expression', () => {
        expect(httpProbe.getRequest(/images-na.*AmazonGatewayAuiAssets/).length).to.be.equal(2);
    });

    it('finds by partial string', () => {
        expect(httpProbe.getRequest('AmazonGatewayAuiAssets').length).to.be.equal(2);
    });

    it('registers an execution a single request', () => {
        expect(httpProbe.getRequest('feedback-us.js').executed).to.be.true;
    });

    it('registers an execution as once', () => {
        expect(httpProbe.getRequest('feedback-us.js').executedOnce).to.be.true;
    });

    it('registers an execution as twice', () => {
        expect(httpProbe.getRequest('x-locale').executedTwice).to.be.true;
    });

    it('registers an execution as thrice', () => {
        expect(httpProbe.getRequest('cloudfront').executedThrice).to.be.true;
    });

    it('provides the first execution', () => {
        let request = httpProbe.getRequest('feedback-us.js');
        expect(request.first).to.be.deep.equal(request.last);
    });

    it('provides the second execution', () => {
        let request = httpProbe.getRequest('x-locale');
        expect(request.second).to.be.deep.equal(request.last);
    });

    it('provides the third execution', () => {
        let request = httpProbe.getRequest('cloudfront');
        expect(request.third).to.be.deep.equal(request.last);
    });

    it('includes method', () => {
        expect(httpProbe.getRequest('feedback-us.js').first.method).to.be.equal('GET');
    });

    it('includes url', () => {
        expect(httpProbe.getRequest('feedback-us.js').first.url).to.be.equal('https://dq4ijymydgrfx.cloudfront.net/2016-09-06/feedback-us.js');
    });

    it('includes headers', () => {
        expect(httpProbe.getRequest('feedback-us.js').first.headers).to.have.all.keys('Referer', 'User-Agent');
    });

});
