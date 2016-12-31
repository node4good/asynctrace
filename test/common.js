'use strict';
const fs = require('fs');
const fd = fs.openSync("raw_out.log", 'a');
function writeSync(str) {
    console._stdout.write(str);
    fs.writeSync(fd, str);
}
global.log = writeSync;
require('..');
