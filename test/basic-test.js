'use strict';
/*globals log */
const domain = require('domain');
const expect = require('chai').expect;
require('./common.js');

describe('setImmediate', function () {
    it('show what happens to a local Exception', function (done) {
        const d = domain.createDomain();
        let i = 0;
        d.once('error', function (e) {
            log(e.stack);
            expect(e.message).to.be.equal('gaga');
            expect(e.stack).to.contain('a ');
            expect(e.stack).to.contain('b ');
            expect(e.stack).to.contain('c ');
            expect(e.stack).to.contain('d ');
            expect(e.stack).to.contain('e ');
            if (--i === 0) done();
        });
        d.run(function z() {
            setImmediate(function a() {
                setImmediate(function b() {
                    setImmediate(function c() {
                        setImmediate(function d() {
                            setImmediate(function e() {
                                ++i;
                                throw new Error('gaga');
                            });
                        });
                    });
                });
            });
        });
    });


    it('show what happens to a exception in itertwining contexts', function (done) {
        const d = domain.createDomain();
        let i = 0;
        d.once('error', function (e) {
            expect(e.message).to.be.equal('gaga1');
            expect(e.stack).to.contain('a2 ');
            expect(e.stack).to.contain('b2 ');
            expect(e.stack).to.contain('c2 ');
            expect(e.stack).to.contain('d2 ');
            expect(e.stack).to.contain('e2 ');
            --i;
            d.once('error', function (e1) {
                log(e1.stack);
                expect(e1.message).to.be.equal('gaga2');
                expect(e1.stack).to.contain('a2 ');
                expect(e1.stack).to.contain('b2 ');
                expect(e1.stack).to.contain('c2 ');
                expect(e1.stack).to.contain('d21 ');
                expect(e1.stack).to.contain('e21 ');
                if (--i === 0) done();
            });
        });
        d.run(function z() {
            setImmediate(function a2() {
                setImmediate(function b2() {
                    setImmediate(function c2() {
                        setImmediate(function d2() {
                            setImmediate(function e2() {
                                ++i;
                                throw new Error('gaga1');
                            });
                        });
                        setImmediate(function d21() {
                            setImmediate(function e21() {
                                ++i;
                                throw new Error('gaga2');
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
        const d = domain.createDomain();
        let i = 0;
        d.once('error', function y(e) {
            log(e.stack);
            expect(e.message).to.be.equal('gaga4');
            expect(e.stack).to.contain(' a ');
            expect(e.stack).to.contain(' b ');
            expect(e.stack).to.contain(' c ');
            expect(e.stack).to.contain(' d ');
            expect(e.stack).to.contain(' e ');
            if (--i === 0) done();
        });
        d.run(function z() {
            process.nextTick(function a() {
                process.nextTick(function b() {
                    process.nextTick(function c() {
                        process.nextTick(function d() {
                            process.nextTick(function e() {
                                ++i;
                                throw new Error('gaga4');
                            });
                        });
                    });
                });
            });
        });
    });


    it('show what happens to a exception in itertwining contexts', function (done) {
        const d = domain.createDomain();
        let i = 0;
        d.once('error', function y(e) {
            expect(e.message).to.be.equal('gaga5');
            expect(e.stack).to.contain(' a2 ');
            expect(e.stack).to.contain(' b2 ');
            expect(e.stack).to.contain(' c2 ');
            expect(e.stack).to.contain(' d2 ');
            expect(e.stack).to.contain(' e2 ');
            --i;
            d.once('error', function x(e) {
                log(e.stack);
                expect(e.message).to.be.equal('gaga6');
                expect(e.stack).to.contain(' a2 ');
                expect(e.stack).to.contain(' b2 ');
                expect(e.stack).to.contain(' c2 ');
                expect(e.stack).to.contain(' d21 ');
                expect(e.stack).to.contain(' e21 ');
                if (--i === 0) done();
            });
        });
        d.run(function z() {
            process.nextTick(function a2() {
                process.nextTick(function b2() {
                    process.nextTick(function c2() {
                        process.nextTick(function d2() {
                            process.nextTick(function e2() {
                                ++i;
                                throw new Error('gaga5');
                            });
                        });
                        process.nextTick(function d21() {
                            process.nextTick(function e21() {
                                ++i;
                                throw new Error('gaga6');
                            });
                        });
                    });
                });
            });
        });
    });
});


describe('fs.readFile', function () {
    const fs = require('fs');
    it('show what happens to a local Exception', function (done) {
        const d = domain.createDomain();
        let i = 0;
        d.once('error', function y(e) {
            log(e.stack);
            expect(e.message).to.be.equal('gaga7');
            expect(e.stack).to.contain(' a ');
            expect(e.stack).to.contain(' b ');
            expect(e.stack).to.contain(' c ');
            expect(e.stack).to.contain(' d ');
            expect(e.stack).to.contain(' e ');
            if (--i === 0) done();
        });
        d.run(function z() {
            fs.readFile('package.json', function a() {
                fs.readFile('package.json', function b() {
                    fs.readFile('package.json', function c() {
                        fs.readFile('package.json', function d() {
                            fs.readFile('package.json', function e() {
                                ++i;
                                throw new Error('gaga7');
                            });
                        });
                    });
                });
            });
        });
    });


    it('show what happens to a exception in itertwining contexts', function (done) {
        const d = domain.createDomain();
        let i = 0;
        d.once('error', function y(e) {
            log(e.stack);
            expect(e.message).to.be.equal('gaga8');
            expect(e.stack).to.contain(' a2 ');
            expect(e.stack).to.contain(' b2 ');
            expect(e.stack).to.contain(' c2 ');
            expect(e.stack).to.contain(' d2 ');
            expect(e.stack).to.contain(' e2 ');
            --i;
            d.once('error', function x(e) {
                log(e.stack);
                expect(e.message).to.be.equal('gaga9');
                expect(e.stack).to.contain(' a2 ');
                expect(e.stack).to.contain(' b2 ');
                expect(e.stack).to.contain(' c2 ');
                expect(e.stack).to.contain(' d21 ');
                expect(e.stack).to.contain(' e21 ');
                if (--i === 0) done();
            });
        });
        d.run(function z() {
            fs.readFile('package.json', function a2() {
                fs.readFile('package.json', function b2() {
                    fs.readFile('package.json', function c2() {
                        fs.readFile('package.json', function d2() {
                            fs.readFile('package.json', function e2() {
                                ++i;
                                throw new Error('gaga8');
                            });
                        });
                        setTimeout(() => {
                            fs.readFile('package.json', function d21() {
                                fs.readFile('package.json', function e21() {
                                    ++i;
                                    throw new Error('gaga9');
                                });
                            });
                        }, 100);
                    });
                });
            });
        });
    });
});
