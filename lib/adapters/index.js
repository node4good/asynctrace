'use strict';
var fs = require('fs');
fs.readdirSync(__dirname)
    .filter(function (file) { return file != 'index.js'; })
    .map(function (file) { return file.split('.')[0]; })
    .forEach(function (file) { module.exports[file] = require('./' + file); });
