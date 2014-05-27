'use strict';
require('asynctrace')

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
