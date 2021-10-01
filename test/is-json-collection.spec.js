const expect = require('chai').expect,
      sinon  = require('sinon');

let {isJsonCollection} = require('../src/util/is-json-collection');

describe('Is JSON Collection', () => {

    it('returns false for Null', () => {
        expect(isJsonCollection(null)).to.be.false;
    });

    it('returns true for Object', () => {
        expect(isJsonCollection('{"hello":"there"}')).to.be.true;
    });

    it('returns true for Array', () => {
        expect(isJsonCollection('[1, 1, 3, 8, 5]')).to.be.true;
    });

    it('returns false for the empty string', () => {
        expect(isJsonCollection('')).to.be.false;
    });

});
