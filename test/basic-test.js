'use strict';
var domain = require('domain');
var expect = require('chai').expect;

describe('setImmediate', function () {
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


    it('show what happens to a exception in itertwining contexts', function (done) {
        var i = 2;
        var d = domain.createDomain();
        d.once('error', function (e) {
          console.log(e.stack)
          expect(e.message).to.be.equal('gaga');
            expect(e.stack).to.contain('Immediate.a2');
            expect(e.stack).to.contain('Immediate.b2');
            expect(e.stack).to.contain('Immediate.c2');
            expect(e.stack).to.contain('Immediate.d2');
            expect(e.stack).to.contain('Immediate.e2');
            --i
            d.once('error', function (e) {
              console.log(e.stack)
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



describe('nextTick', function () {
    it('show what happens to a local Exception', function (done) {
        var i = 1;
        var d = domain.createDomain();
        d.once('error', function (e) {
            console.log(e.stack)
            expect(e.message).to.be.equal('gaga');
            expect(e.stack).to.contain(' a ');
            expect(e.stack).to.contain(' b ');
            expect(e.stack).to.contain(' c ');
            expect(e.stack).to.contain(' d ');
            expect(e.stack).to.contain(' e ');
            if (--i == 0) done();
        });
        d.run(function () {
            process.nextTick(function a() {
                process.nextTick(function b() {
                    process.nextTick(function c() {
                        process.nextTick(function d() {
                            process.nextTick(function e() {
                                throw new Error('gaga');
                            });
                        });
                    });
                });
            });
        });
    });


    it('show what happens to a exception in itertwining contexts', function (done) {
        var i = 2;
        var d = domain.createDomain();
        d.once('error', function (e) {
          console.log(e.stack)
          expect(e.message).to.be.equal('gaga');
            expect(e.stack).to.contain(' a2 ');
            expect(e.stack).to.contain(' b2 ');
            expect(e.stack).to.contain(' c2 ');
            expect(e.stack).to.contain(' d2 ');
            expect(e.stack).to.contain(' e2 ');
            --i
            d.once('error', function (e) {
              console.log(e.stack)
              expect(e.message).to.be.equal('gaga1');
                expect(e.stack).to.contain(' a2 ');
                expect(e.stack).to.contain(' b2 ');
                expect(e.stack).to.contain(' c2 ');
                expect(e.stack).to.contain(' d21 ');
                expect(e.stack).to.contain(' e21 ');
                if (--i == 0) done();
            });
        });
        d.run(function () {
            process.nextTick(function a2() {
                process.nextTick(function b2() {
                    process.nextTick(function c2() {
                        process.nextTick(function d2() {
                            process.nextTick(function e2() {
                                throw new Error('gaga');
                            });
                        });
                        process.nextTick(function d21() {
                            process.nextTick(function e21() {
                                throw new Error('gaga1');
                            });
                        });
                    });
                });
            });
        });
    });
});


describe('fs.readFile', function () {
    var fs = require('fs');
    it('show what happens to a local Exception', function (done) {
        var i = 1;
        var d = domain.createDomain();
        d.once('error', function (e) {
            console.log(e.stack)
            expect(e.message).to.be.equal('gaga');
            expect(e.stack).to.contain(' a ');
            expect(e.stack).to.contain(' b ');
            expect(e.stack).to.contain(' c ');
            expect(e.stack).to.contain(' d ');
            expect(e.stack).to.contain(' e ');
            if (--i == 0) done();
        });
        d.run(function () {
            fs.readFile('package.json', function a() {
                fs.readFile('package.json', function b() {
                    fs.readFile('package.json', function c() {
                        fs.readFile('package.json', function d() {
                            fs.readFile('package.json', function e() {
                                throw new Error('gaga');
                            });
                        });
                    });
                });
            });
        });
    });


    it('show what happens to a exception in itertwining contexts', function (done) {
        var i = 2;
        var d = domain.createDomain();
        d.once('error', function (e) {
          console.log(e.stack)
          expect(e.message).to.be.equal('gaga');
            expect(e.stack).to.contain(' a2 ');
            expect(e.stack).to.contain(' b2 ');
            expect(e.stack).to.contain(' c2 ');
            expect(e.stack).to.contain(' d2 ');
            expect(e.stack).to.contain(' e2 ');
            --i
            d.once('error', function (e) {
              console.log(e.stack)
              expect(e.message).to.be.equal('gaga1');
                expect(e.stack).to.contain(' a2 ');
                expect(e.stack).to.contain(' b2 ');
                expect(e.stack).to.contain(' c2 ');
                expect(e.stack).to.contain(' d21 ');
                expect(e.stack).to.contain(' e21 ');
                if (--i == 0) done();
            });
        });
        d.run(function () {
            fs.readFile('package.json', function a2() {
                fs.readFile('package.json', function b2() {
                    fs.readFile('package.json', function c2() {
                        fs.readFile('package.json', function d2() {
                            fs.readFile('package.json', function e2() {
                                throw new Error('gaga');
                            });
                        });
                        fs.readFile('package.json', function d21() {
                            fs.readFile('package.json', function e21() {
                                throw new Error('gaga1');
                            });
                        });
                    });
                });
            });
        });
    });
});
