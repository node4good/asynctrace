'use strict';
var fs = require('fs');
var fd = fs.openSync("raw_out.log", 'a');
function writeSync(str) {
    var buffer = new Buffer(str, 'utf8');
    fs.writeSync(process.stdout.fd, buffer, 0, buffer.length, null);
    fs.writeSync(fd, buffer, 0, buffer.length, null);
}
global.log = writeSync;
