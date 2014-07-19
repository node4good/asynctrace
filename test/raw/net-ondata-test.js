'use strict';
require('../../');
var net = require('net');

var server;
var address;
var i = 2;
process.on('uncaughtException', function (err) {
    setImmediate(function () { console.log('---- process exception ----\n', err.stack || err, '\n---- end ----'); });
    if (--i === 0) setImmediate(process.exit.bind(process));
});


setImmediate(function d1() {
    server = net.createServer();
    server.on('connection', function onServerConnection(socket) {
        process.nextTick(function () { throw new Error("gogo"); });
        socket.on("data", function onServerSocketData(data) {
            server.close();
            process.nextTick(function miri() { throw new Error("gaga"); });
        });
    });
});

setImmediate(function d2() {
    server.listen(function onServerListen() {
        address = server.address();
        var client = net.connect(address.port);
        client.on('connect', function onClientConnect() {
            client.write("gigi");
        });
    });
});
