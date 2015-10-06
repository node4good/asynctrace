'use strict';
var fs = require('fs');
var fd = fs.openSync("raw_out.log", 'a');
function writeSync(str) {
    console._stdout.write(str);
    fs.write(fd, str);
}
global.log = writeSync;
