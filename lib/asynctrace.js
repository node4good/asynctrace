'use strict';
try {
    var tracing = require('tracing');
} catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') throw e;
    require('../node_modules/async-listener');
    tracing = process;
}
try {
    var util = require('util');
    var debug = util.debuglog('asynctrace');
} catch (e) {
    debug = console.error.bind(console);
}
var stackAPIClient = require('./JavaScriptStackTraceApi_client');
var Path = require('path');
var sep = Path.sep;
var PATH_PREFIX = Path.normalize(process.cwd());


var settings = {
    // `null`ing a style will remove it from the trace output
    tracingStyle: "\x1B[1;37m",
    modulesStyle: "\x1B[32m",
    globalsStyle: "\x1B[95m",
    coreStyle: "\x1B[37m",
    localsStyle: "\x1B[30;1m",
    resetStyle: "\x1B[0m",
    mocha: true,
    useColors: true,
    BOUNDARY: '==  <sync boundary>',
    NEXUS: '    <the nexus>\n'
};


var evt = tracing.createAsyncListener({
    create: asyncFunctionInitialized,
    before: asyncCallbackBefore,
    after: asyncCallbackAfter,
    error: asyncCallbackError
});


function asyncFunctionInitialized(oldFrames) {
    oldFrames = oldFrames || Error._frames || [];
    var frames = stackAPIClient.getStackFrames(asyncFunctionInitialized);
    var funcName;
    try {
        funcName = frames[1] && frames[1].getFunctionName();
    } catch (e) {
    }
    if (funcName === 'createTCP') return oldFrames;
    frames.unshift(settings.BOUNDARY);
    frames.push.apply(frames, oldFrames);
    Error._frames = frames;
    return frames;
}


function asyncCallbackBefore(__, frames) {
    Error._frames = frames;
}


function asyncCallbackAfter(__, frames) {
    Error._frames = frames;
}


function asyncCallbackError(oldFrames, error) {
    if (error._passed) return;
    var frames = (oldFrames || []);
    formatStack(error, frames);
    error._passed = true;
}


function setup() {
    Error._frames = null;
    tracing.addAsyncListener(evt);
}


function teardown() {
    tracing.removeAsyncListener(evt);
    Error._frames = null;
}


/* ===================== stack chain manipulation & formating ======================== */

function categorizeFrame(frame) {
    var filename = frame && frame.getFileName && Path.normalize(frame.getFileName());
    if (!filename)
        return 'core';
    else if (filename === 'tracing.js')
        return 'tracing';
    else if (!~filename.indexOf(sep))
        return 'core';
    else if (filename.indexOf(PATH_PREFIX) !== 0)
        return 'globals';
    else if (~(filename.replace(PATH_PREFIX, '')).indexOf('node_modules'))
        return 'modules';
    else
        return 'locals';
}

function reducer(seed, frame) {
    if (!frame) return seed;
    if (typeof frame == 'string') {
        if (frame != seed[seed.length - 1]) seed.push(frame);
        return seed;
    }
    frame._section = categorizeFrame(frame);
    frame._prefix = getPrefix(frame);
    frame._suffix = getSuffix(frame);
    if (frame._prefix) seed.push(frame);
    return seed;
}

function formatStack(error, frames) {
    var latestFrames = stackAPIClient.extractFrames(error);
    frames = ['\n' + error.name + ': ' + error.message].concat(latestFrames).concat([settings.BOUNDARY]).concat(frames);
    frames.push(settings.NEXUS);
    error.stack = frames.reduce(reducer, []).map(frameToString).join("\n");
}

function frameToString(frame) {
    if (typeof frame == 'string') {
        return getStyle('locals') + frame + getSuffix(frame);
    }
    var line;
    try {
        line = frame.toString();
    } catch (e) {
        try {
            line = "<error: " + e + ">";
        } catch (ee) {
            // Any code that reaches this point is seriously nasty!
            line = "<error>";
        }
    }
    return frame._prefix + line + frame._suffix;
}

function getStyle(sec) {
    var ANSICode = settings[sec + 'Style'];
    if (!ANSICode) return null;
    var preCode = settings.useColors ? ANSICode : '';
    return preCode;
}

function getPrefix(frame) {
    var sec = frame._section;
    var preCode = getStyle(sec);
    if (preCode === null) return;
    var postCode = settings.useColors ? settings.resetStyle : '';
    var secCode = "<" + preCode + sec + postCode + ">" + preCode;
    var prefix = "at  " + secCode + "          ".slice(0, 11 - sec.length);
    return prefix;
}

function getSuffix() {
    var suffix = settings.useColors ? settings.resetStyle : '';
    return suffix;
}

/* ===================== Init ======================== */
if (process.env.NOASYNCTRACE) return;
setup();

var adapters = require('./adapters');
if (settings.mocha)
    adapters.mocha(settings, setup, teardown);
