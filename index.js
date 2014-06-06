'use strict';
var verParts = process.version.split(/\.|-/g);
if (verParts[1] < 11 || verParts[2] < 12) {
    console.error("asynctrace needs node at least of version 0.11.12 to work");
    console.error("So it'll do nothing here :(");
    return;
}
var tracing = require('tracing');
var util = require('util');
var prefix = process.cwd().toLowerCase();
var sep = require('path').sep;

var settings = {
    // `null`ing a style will remove it from the trace output
    tracingModuleStyle: null,//"\x1B[32m",
    coreStyle: "\x1B[32m",
    modulesStyle: "\x1B[33m",
    ownStyle: "\x1B[1m",
    mocha: true,
    BOUNDARY: '    \x1B[35m[sync boundary]\x1B[0m'
};

tracing.addAsyncListener({
    'create': asyncFunctionInitialized,
    'before': asyncCallbackBefore,
    'error': asyncCallbackError,
    'after': asyncCallbackAfter
});


function asyncFunctionInitialized(oldFrames) {
    var frames = StackError.getStackFrames(asyncFunctionInitialized);
    frames.unshift(settings.BOUNDARY);
    frames.push.apply(frames, oldFrames || Error._frames);
    Error._frames = frames;
    return frames;
}

function asyncCallbackBefore(_, frames) {
    Error._frames = frames;
}


function asyncCallbackAfter(_, frames) {
    Error._frames = frames;
}


function asyncCallbackError(oldFrames, error) {
    if (error._passed) return;
    var frames = (oldFrames || []).reduce(reducer, []);
    error.stack += v8StackFormating('', frames);
    error._passed = true;
}



/* ===================== stack chain util ======================== */

function StackError(otp) {
    Error.captureStackTrace(this, otp);
    Error.prepareStackTrace = function justStoreStackStace(error, frames) {
        error._frames = frames;
        return '';
    };
    this.stack;  // jshint ignore:line
    delete Error.prepareStackTrace;
}
StackError.getStackFrames = function getStackFrames(otp) {
    return (new this(otp))._frames;
};
util.inherits(StackError, Error);


/* ===================== stack chain manipulation & formating ======================== */

function categorizeFrame(frame) {
    var name = frame && frame.getFileName() && frame.getFileName().toLowerCase();
    if (!name) return (frame._style = settings.coreStyle);
    if (name === 'tracing.js') return (frame._style = settings.tracingModuleStyle);
    if (!~name.indexOf(sep)) return (frame._style = settings.coreStyle);
    if (name.indexOf(prefix) !==0) return (frame._style = settings.coreStyle);
    if (~name.replace(prefix, '').indexOf('node_modules')) return (frame._style = settings.modulesStyle);
    frame._style = settings.ownStyle;
}

function reducer(seed, frame) {
    if (typeof frame == 'string') {
        if (frame != seed[seed.length - 1]) seed.push(frame);
        return seed;
    }
    categorizeFrame(frame);
    seed.push(frame);
    return seed;
}


function v8StackFormating(error, frames) {
    var lines = [];
    lines.push(error.toString());
    frames.push({ toString: function () { return '<the nexus>\n';}, _style: settings.coreStyle });
    for (var i = 0; i < frames.length; i++) {
        var frame = frames[i];
        if (typeof frame == 'string') {
            lines.push(frame);
            continue;
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
        var prefix = frame._style + "    at ";
        var suffix = "\x1B[0m";
        if (frame._style) lines.push(prefix + line + suffix);
    }
    return lines.join("\n");
}


/* ===================== 3rd party integrations ======================== */

function setupForMocha() {
    try {
        require('shimmer').wrap(require('mocha').prototype, 'run', function (original) {
            return function () {
                var runner = original.apply(this, arguments);
                runner.on('test', function () {
                    Error._frames = null;
                });
            };
        });
    } catch (e) {
        console.log(e);
    }
}
if (settings.mocha) setupForMocha();
