'use strict';
/*globals log */
const net = require('net');
const Domain = require('domain');
const expect = require('chai').expect;
require('./common.js');

function mySignal(n) { setImmediate(function () {throw new Error(n);}); }

describe('net module', function () {
    if (process.version.indexOf('v0.10') === 0)
        it("I won't touch this in v0.10", function (done) {done();});
    else
        it("client server", function (done) {
            const DATUM1 = "Hello";
            const DATUM2 = "GoodBye";
            let server;
            let address;

            const domain = Domain.create();
            domain.on('error', function (err) {
                const msg = err.message;
                const stack = err.stack;
                log(stack);
                switch (msg) {
                    case "1":
                        expect(stack).to.to.contain('d1 ');
                        break;
                    case "2":
                        expect(stack).to.to.contain('d2 ');
                        expect(stack).to.to.contain('onServerListen ');
                        break;
                    case "3":
                        expect(stack).to.to.contain('d2 ');
                        break;
                    case "4":
                        expect(stack).to.to.contain('d2 ');
                        break;
                    case "5a":
                        expect(stack).to.to.contain('onServerConnection ');
                        break;
                    case "5b":
                        expect(stack).to.to.contain('d2 ');
                        expect(stack).to.to.contain('onClientConnect ');
                        break;
                    case "7":
                        // this is not stable!
//                    expect(stack).to.to.contain('.d1 ');
//                    expect(stack).to.to.contain('.d2 ');
                        expect(stack).to.to.contain('onServerSocketData ');
                        expect(stack).to.to.contain('runInDomain2 ');
                        break;
                    case "8":
                        expect(stack).to.to.contain('d2 ');
                        expect(stack).to.to.contain('onClientSocketData ');
                        break;
                    case "9":
                        expect(stack).to.to.contain('d2 ');
                        expect(stack).to.to.contain('onClientSocketEnd ');
                        break;
                    default:
                        done("what? " + msg);
                }
                return true;
            });

            domain.run(function runInDomain() {
                setImmediate(function d1() {
                    Error._frames = null;
                    server = net.createServer(function onServerConnection(socket) {
                        mySignal('5a');
                        socket.on("data", function onServerSocketData(data) {
                            domain.run(function runInDomain2() {
                                expect(data.toString('utf-8')).equal(DATUM1, "should get DATUM1");
                                mySignal("7");
                                socket.end(DATUM2);
                                server.close();
                            });
                        });
                    });
                    mySignal('1');
                });

                setImmediate(function d2() {
                    Error._frames = null;
                    server.listen(function onServerListen() {
                        mySignal('2');
                        address = server.address();
                        mySignal('3');
                        const client = net.connect(address.port, function onClientConnect() {
                            mySignal('5b');
                            client.write(DATUM1);
                            client.on("data", function onClientSocketData(data) {
                                mySignal("8");
                                expect(data.toString('utf-8')).equal(DATUM2, "should get DATUM1");
                            });
                            client.on('close', function onClientSocketEnd() {
                                mySignal("9");
                                done();
                            });
                        });
                        mySignal('4');
                    });
                });
            });
        });
});
