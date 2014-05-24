'use strict';

require('asynctrace');
setImmediate(function a() {
    setImmediate(function b() {
        setImmediate(function c() {
            setImmediate(function d() {
                setImmediate(function e() {
                    throw new Error('gaga');
                });
            });
            setImmediate(function d1() {
                setImmediate(function e1() {
                    throw new Error('gaga1');
                });
            });
        });
    });
});

process.on('uncaughtException', function (e) {
    console.log('####');
    console.log(e.stack);
    console.log('####');
});
