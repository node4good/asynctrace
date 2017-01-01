'use strict';
const domain = require('domain');
const expect = require('chai').expect;
require('./common.js');

describe('generators', function () {
    it('show what happens to an Exception from a generator', function (done) {
        const d = domain.createDomain();
        d.once('error', function (e) {
            expect(e.message).not.contain('Path');
            expect(e.message).to.contain('gaga-4');
            expect(e.stack).to.contain('a ');
            expect(e.stack).to.contain('b ');
            done();
        });
        d.run(function a() {
            setImmediate(function b() {
                function* gen() {
                    yield 1;
                    throw new Error('gaga-4')
                }

                for (let g of gen()) {
                    expect(g).to.be.equal(1);
                }
            })
        });
    });
});
