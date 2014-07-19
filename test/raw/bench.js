'use strict';
require('../../');
var getStackFrames_better = require('../../wip/getStackFrames_better');
//var v8n = require('v8-natives');
//var v8p = require('v8-profiler');
//var fs = require('fs');

var x, i, startTime, endTime;
//v8p.startProfiling('captureStackTrace');
//var x = v8n.helpers.benchmark(1000000, Error.captureStackTrace, e);
startTime = process.hrtime();
for(i=0; i<100000; ++i) x = Error.getStackFrames();
endTime = process.hrtime(startTime);
console.log(JSON.stringify(x, null, "  "));
console.log(endTime);
//console.log("x=%d", x);
//var cpuProfile = v8p.stopProfiling('captureStackTrace');
//fs.writeFileSync('captureStackTrace.log', JSON.stringify(cpuProfile, null, "  "));

//v8p.startProfiling('getRawStackFrames');
startTime = process.hrtime();
for(i=0; i<100000; ++i) x = getStackFrames_better();
console.log(JSON.stringify(x, null, "  "));
endTime = process.hrtime(startTime);
console.log(endTime);
//var cpuProfile2 = v8p.stopProfiling('getRawStackFrames');
//fs.writeFileSync('getRawStackFrames.log', JSON.stringify(cpuProfile2, null, "  "));
