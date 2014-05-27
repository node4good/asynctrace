'use strict';
var domain = require('domain');
var expect = require('chai').expect;

describe('simple', function () {
    it('show what happens to a local Exception', function (done) {
        var i = 1;
        var d = domain.createDomain();
        d.once('error', function (e) {
            console.log(e.stack)
            expect(e.message).to.be.equal('gaga');
            expect(e.stack).to.contain('Immediate.a');
            expect(e.stack).to.contain('Immediate.b');
            expect(e.stack).to.contain('Immediate.c');
            expect(e.stack).to.contain('Immediate.d');
            expect(e.stack).to.contain('Immediate.e');
            if (--i == 0) done();
        });
        d.run(function () {
            setImmediate(function a() {
                setImmediate(function b() {
                    setImmediate(function c() {
                        setImmediate(function d() {
                            setImmediate(function e() {
                                throw new Error('gaga');
                            });
                        });
                    });
                });
            });
        });
    });


    it('show what happens to a local Exception', function (done) {
        var i = 2;
        var d = domain.createDomain();
        d.once('error', function (e) {
            expect(e.message).to.be.equal('gaga');
            expect(e.stack).to.contain('Immediate.a2');
            expect(e.stack).to.contain('Immediate.b2');
            expect(e.stack).to.contain('Immediate.c2');
            expect(e.stack).to.contain('Immediate.d2');
            expect(e.stack).to.contain('Immediate.e2');
            --i
            d.once('error', function (e) {
                expect(e.message).to.be.equal('gaga1');
                expect(e.stack).to.contain('Immediate.a2');
                expect(e.stack).to.contain('Immediate.b2');
                expect(e.stack).to.contain('Immediate.c2');
                expect(e.stack).to.contain('Immediate.d21');
                expect(e.stack).to.contain('Immediate.e21');
                if (--i == 0) done();
            });
        });
        d.run(function () {
            setImmediate(function a2() {
                setImmediate(function b2() {
                    setImmediate(function c2() {
                        setImmediate(function d2() {
                            setImmediate(function e2() {
                                throw new Error('gaga');
                            });
                        });
                        setImmediate(function d21() {
                            setImmediate(function e21() {
                                throw new Error('gaga1');
                            });
                        });
                    });
                });
            });
        });
    });
});
