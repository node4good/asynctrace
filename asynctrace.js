'use strict';
try {
    var tracing = require('tracing');
} catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') throw e;
    require('async-listener');
    tracing = process;
}
var util = require('util');
var PATH_PREFIX = process.cwd().toLowerCase();
var sep = require('path').sep;

var settings = {
    // `null`ing a style will remove it from the trace output
    tracingModuleStyle: null,
//    tracingModuleStyle: "\x1B[31m",
    modulesStyle: "\x1B[32m",
    globalsStyle: "\x1B[33m",
    coreStyle: "\x1B[34m",
    ownStyle: "\x1B[1m",
    mocha: true,
    BOUNDARY: '    [sync boundary]',
    useColors: true
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
    if (!name) return (frame._section = 'core');
    if (name === 'tracing.js') return (frame._section = 'tracingModule');
    if (!~name.indexOf(sep)) return (frame._section = 'core');
    if (name.indexOf(PATH_PREFIX) !== 0) return (frame._section = 'globals');
    if (~(name.replace(PATH_PREFIX, '')).indexOf('node_modules')) return (frame._section = 'modules');
    frame._section = 'own';
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
    frames.push({ toString: function () { return '<the nexus>\n';}, _section: 'core' });
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
        var style = getStyle(frame._section);
        var prefix = style + "    at ";
        var suffix = settings.useColors ? "\x1B[0m" : '';
        if (typeof style == 'string') lines.push(prefix + line + suffix);
    }
    return lines.join("\n");
}


function getStyle(sec) {
    return (settings.useColors) ? settings[sec + 'Style'] : '';
}


/* ===================== 3rd party integrations ======================== */

function setupForMocha() {
    try {
        var mocha = Object.keys(require.cache)
            .filter(function (k) {return ~k.search(/mocha.index\.js/)})
            .map(function (k) { return require.cache[k].exports; })
            .pop();
        var shimmer = require('shimmer');
        shimmer.wrap(mocha.prototype, 'run', function (original) {
            return function () {
                var runner = original.apply(this, arguments);
                settings.useColors = this.options.useColors;
                runner.on('test', function () {
                    Error._frames = null;
                });
            };
        });
    } catch (e) {
        if (e.code !== 'MODULE_NOT_FOUND') console.error(e);
    }
}
if (settings.mocha) setupForMocha();
