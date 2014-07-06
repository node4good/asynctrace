asynctrace
==========

Deep stack traces based on AsyncListener API

[![Build Status](https://travis-ci.org/TheNodeILs/asynctrace.png?branch=master "Build Status")](https://travis-ci.org/TheNodeILs/asynctrace)


## Install
You know the drill
```
npm i asynctrace --save-dev
```

## Example Usage
```js
// simply require, somewhere near the process entry point
require('asynctrace')
```

specificaly made compatible with mocha
```
mocha --require asynctrace
```


## Example
for this code:
```
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
```
You'll get the following stack trace:
```
                    throw new Error('gaga');
                          ^
Error: gaga
    at Immediate.e [as _onImmediate] (C:\projects\trowExample\trowwer.js:9:27)
    at processImmediate [as _immediateCallback] (timers.js:374:17)
     - - - - - - async boundary  - - - - - -
    at Immediate.d [as _onImmediate] (C:\projects\trowExample\trowwer.js:8:17)
     - - - - - - async boundary  - - - - - -
    at Immediate.c [as _onImmediate] (C:\projects\trowExample\trowwer.js:7:13)
     - - - - - - async boundary  - - - - - -
    at Immediate.b [as _onImmediate] (C:\projects\trowExample\trowwer.js:6:9)
     - - - - - - async boundary  - - - - - -
    at Immediate.a [as _onImmediate] (C:\projects\trowExample\trowwer.js:5:5)
     - - - - - - async boundary  - - - - - -
    at Object.<anonymous> (C:\projects\trowExample\trowwer.js:4:1)
     - - - - - - async boundary  - - - - - -
```


## Performance
There is a performance price with using AsyncListner, but we were able to minimize it. For example here are timing on running the full visionmedia/express test suite:
```
[10:50:28 /empeeric/3party/express] time  mocha --require asynctrace --require test/support/env --reporter dot --check-leaks test/ test/acceptance/

  ..................................................................

  513 passing (7s)

real    0m8.061s
user    0m0.045s
sys     0m0.075s



[10:50:41 /empeeric/3party/express] time  mocha --require test/support/env --reporter dot --check-leaks test/ test/acceptance/

  ..................................................................

  513 passing (5s)

real    0m6.314s
user    0m0.030s
sys     0m0.075s
```
