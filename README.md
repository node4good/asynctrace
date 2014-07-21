asynctrace
==========

Deep stack traces based on AsyncListener API

[![Build Status](https://travis-ci.org/TheNodeILs/asynctrace.png?branch=master "Build Status")](https://travis-ci.org/TheNodeILs/asynctrace)


[![NPM](https://nodei.co/npm-dl/asynctrace.png)](https://nodei.co/npm/asynctrace/)


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
at  <locals>     Immediate.e [as _onImmediate] (c:\empeeric\0tni\asynctrace\test\basic-test.js:27:39)
at  <core>       processImmediate [as _immediateCallback] (timers.js:374:17)
==  <sync boundary>
at  <tracing>    runAsyncQueue (tracing.js:166:25)
at  <core>       exports.setImmediate (timers.js:441:5)
at  <core>       global.setImmediate (node.js:198:29)
at  <locals>     Immediate.d [as _onImmediate] (c:\empeeric\0tni\asynctrace\test\basic-test.js:25:29)
at  <core>       processImmediate [as _immediateCallback] (timers.js:374:17)
==  <sync boundary>
at  <tracing>    runAsyncQueue (tracing.js:166:25)
at  <core>       exports.setImmediate (timers.js:441:5)
at  <core>       global.setImmediate (node.js:198:29)
at  <locals>     Immediate.c [as _onImmediate] (c:\empeeric\0tni\asynctrace\test\basic-test.js:24:25)
at  <core>       processImmediate [as _immediateCallback] (timers.js:374:17)
==  <sync boundary>
at  <tracing>    runAsyncQueue (tracing.js:166:25)
at  <core>       exports.setImmediate (timers.js:441:5)
at  <core>       global.setImmediate (node.js:198:29)
at  <locals>     Immediate.b [as _onImmediate] (c:\empeeric\0tni\asynctrace\test\basic-test.js:23:21)
at  <core>       processImmediate [as _immediateCallback] (timers.js:374:17)
==  <sync boundary>
at  <tracing>    runAsyncQueue (tracing.js:166:25)
at  <core>       exports.setImmediate (timers.js:441:5)
at  <core>       global.setImmediate (node.js:198:29)
at  <locals>     Immediate.a [as _onImmediate] (c:\empeeric\0tni\asynctrace\test\basic-test.js:22:17)
at  <core>       processImmediate [as _immediateCallback] (timers.js:374:17)
==  <sync boundary>
at  <tracing>    runAsyncQueue (tracing.js:166:25)
at  <core>       exports.setImmediate (timers.js:441:5)
at  <core>       global.setImmediate (node.js:198:29)
at  <locals>     Domain.z (c:\empeeric\0tni\asynctrace\test\basic-test.js:21:13)
at  <core>       Domain.run (domain.js:197:16)
at  <locals>     Context.<anonymous> (c:\empeeric\0tni\asynctrace\test\basic-test.js:20:11)
at  <globals>    Test.Runnable.run (C:\node\node_modules\mocha\lib\runnable.js:196:15)
at  <globals>    Runner.runTest (C:\node\node_modules\mocha\lib\runner.js:373:10)
at  <globals>    C:\node\node_modules\mocha\lib\runner.js:451:12
at  <globals>    next (C:\node\node_modules\mocha\lib\runner.js:298:14)
at  <globals>    C:\node\node_modules\mocha\lib\runner.js:308:7
at  <globals>    next (C:\node\node_modules\mocha\lib\runner.js:246:23)
at  <globals>    Immediate._onImmediate (C:\node\node_modules\mocha\lib\runner.js:275:5)
at  <core>       processImmediate [as _immediateCallback] (timers.js:374:17)
==  <sync boundary>
at  <tracing>    runAsyncQueue (tracing.js:166:25)
at  <core>       Object.exports.active (timers.js:211:5)
at  <core>       exports.setTimeout (timers.js:251:11)
at  <core>       global.setTimeout (node.js:178:27)
at  <globals>    Test.Runnable.resetTimeout (C:\node\node_modules\mocha\lib\runnable.js:138:16)
at  <globals>    Test.Runnable.run (C:\node\node_modules\mocha\lib\runnable.js:193:10)
at  <globals>    Runner.runTest (C:\node\node_modules\mocha\lib\runner.js:373:10)
at  <globals>    C:\node\node_modules\mocha\lib\runner.js:451:12
at  <globals>    next (C:\node\node_modules\mocha\lib\runner.js:298:14)
at  <globals>    C:\node\node_modules\mocha\lib\runner.js:308:7
at  <globals>    next (C:\node\node_modules\mocha\lib\runner.js:246:23)
at  <globals>    Immediate._onImmediate (C:\node\node_modules\mocha\lib\runner.js:275:5)
at  <core>       processImmediate [as _immediateCallback] (timers.js:374:17)
==  <sync boundary>
at  <tracing>    process.runAsyncQueue (tracing.js:166:25)
at  <core>       insert (timers.js:80:12)
at  <core>       Object.exports.active (timers.js:201:7)
at  <core>       exports.setTimeout (timers.js:251:11)
at  <core>       global.setTimeout (node.js:178:27)
at  <globals>    Test.Runnable.resetTimeout (C:\node\node_modules\mocha\lib\runnable.js:138:16)
at  <globals>    Test.Runnable.run (C:\node\node_modules\mocha\lib\runnable.js:193:10)
at  <globals>    Runner.runTest (C:\node\node_modules\mocha\lib\runner.js:373:10)
at  <globals>    C:\node\node_modules\mocha\lib\runner.js:451:12
at  <globals>    next (C:\node\node_modules\mocha\lib\runner.js:298:14)
at  <globals>    C:\node\node_modules\mocha\lib\runner.js:308:7
at  <globals>    next (C:\node\node_modules\mocha\lib\runner.js:246:23)
at  <globals>    Immediate._onImmediate (C:\node\node_modules\mocha\lib\runner.js:275:5)
at  <core>       processImmediate [as _immediateCallback] (timers.js:374:17)
==  <sync boundary>
at  <tracing>    runAsyncQueue (tracing.js:166:25)
at  <core>       Function.exports.setImmediate (timers.js:441:5)
at  <core>       Function.global.setImmediate (node.js:198:29)
at  <globals>    Runner.hook (C:\node\node_modules\mocha\lib\runner.js:274:10)
at  <globals>    next (C:\node\node_modules\mocha\lib\runner.js:301:10)
at  <globals>    C:\node\node_modules\mocha\lib\runner.js:308:7
at  <globals>    next (C:\node\node_modules\mocha\lib\runner.js:246:23)
at  <globals>    Immediate._onImmediate (C:\node\node_modules\mocha\lib\runner.js:275:5)
at  <core>       processImmediate [as _immediateCallback] (timers.js:374:17)
==  <sync boundary>
at  <tracing>    runAsyncQueue (tracing.js:166:25)
at  <core>       Function.exports.setImmediate (timers.js:441:5)
at  <core>       Function.global.setImmediate (node.js:198:29)
at  <globals>    Runner.hook (C:\node\node_modules\mocha\lib\runner.js:274:10)
at  <globals>    next (C:\node\node_modules\mocha\lib\runner.js:301:10)
at  <globals>    Runner.hooks (C:\node\node_modules\mocha\lib\runner.js:312:3)
at  <globals>    Runner.hookDown (C:\node\node_modules\mocha\lib\runner.js:338:8)
at  <globals>    next (C:\node\node_modules\mocha\lib\runner.js:446:10)
at  <globals>    Runner.runTests (C:\node\node_modules\mocha\lib\runner.js:469:3)
at  <globals>    C:\node\node_modules\mocha\lib\runner.js:523:10
at  <globals>    next (C:\node\node_modules\mocha\lib\runner.js:246:23)
at  <globals>    Immediate._onImmediate (C:\node\node_modules\mocha\lib\runner.js:275:5)
at  <core>       processImmediate [as _immediateCallback] (timers.js:374:17)
    <the nexus>
```


## Performance
There is a performance price with using AsyncListener, but we were able to minimize it. For example here are timing on running the full `visionmedia/express` test suite:
```bash
$ time mocha --require test/support/env --reporter dot --check-leaks test/ test/acceptance/
  ..........................................................................................
  563 passing (10s)

real    0m11.423s
user    0m0.015s
sys     0m0.000s

$ time mocha -r asynctrace --require test/support/env --reporter dot --check-leaks test/ test/acceptance/
  ....................................................................................
  563 passing (11s)

real    0m12.288s
user    0m0.000s
sys     0m0.015s
```
