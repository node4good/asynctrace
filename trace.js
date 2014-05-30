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

var BOUNDRY = '    \x1B[32m[sync boundery]\x1B[0m';

var listener = tracing.addAsyncListener({
    'create': asyncFunctionInitialized,
    'before': asyncCallbackBefore,
    'error': asyncCallbackError,
    'after': asyncCallbackAfter
});


function asyncFunctionInitialized(oldFrames) {
    var frames = StackError.getStackFrames(asyncFunctionInitialized);
    frames.push(BOUNDRY);
    frames.push.apply(frames, oldFrames || Error._frames);
    Error._frames = frames;
    return frames;
}

function asyncCallbackBefore(context, frames) {
    Error._frames = frames;
}


function asyncCallbackAfter(context, frames) {
    Error._frames = frames;
}


function asyncCallbackError(oldFrames, error) {
    if (error._passed) return;
    var frames = (oldFrames || []).reduce(reducer, []);
    if (frames[0]) frames[0]._crosses = true;
    error.stack += v8StackFormating('', frames);
    error._passed = true;
}



/* ===================== stack chain manipulation ======================== */


function isInteresting(callSite) {
    var name = callSite && callSite.getFileName();
    if (!name) return false;
    name = name.toLowerCase();
    if (name === 'tracing.js') return false
    if (!~name.indexOf(sep)) return false;
    if (name.indexOf(prefix) != 0) return false;
    if (~name.replace(prefix, '').indexOf('node_modules')) return false;
    return true;
}

function reducer(seed, frame) {
    if (typeof frame == 'string') {
        if (frame != seed[seed.length - 1]) seed.push(frame);
        return seed;
    }
    if (isInteresting(frame)) frame._interesting = true;
    seed.push(frame);
    return seed;
}


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


function v8StackFormating(error, frames) {
    var lines = [];
    lines.push(error.toString());
    frames.push({toString: function () { return '<the nexus>\n'; }});
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
        var prefix = frame._interesting ? "\x1B[1;4m    at " : "\x1B[92;22m    at ";
        var suffix = "\x1B[0m";
        lines.push(prefix + line + suffix);
    }
    return lines.join("\n");
}

function setupForMocha() {
    try {
        require('shimmer').wrap(require('mocha').prototype, 'run', function (original) {
            return function () {
                var runner = original.apply(this, arguments);
                runner.on('test', function (e) {
                    Error._frames = null;
                });
            };
        });
    } catch (e) {
        console.log(e);
    }
}
setupForMocha();
