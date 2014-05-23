'use strict';
var tracing = require('tracing');
var util = require('util');

var BOUNDRY = '     - - - - - - async boundary  - - - - - -';

tracing.addAsyncListener({
  'create': asyncFunctionInitialized,
  'before': asyncCallbackBefore,
  'error': asyncCallbackError,
  'after': asyncCallbackAfter
});


function asyncFunctionInitialized() {
    var frames = StackError.getStackFrames(asyncFunctionInitialized);
    frames.push(BOUNDRY);
    frames.push.apply(frames, Error._frames);
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
    var frames = (oldFrames || []).reduce(reducer, []);
    frames.unshift(BOUNDRY);
    error.stack += v8StackFormating('', frames);
}


/* ===================== stack chain manipulation ======================== */

var sep = require('path').sep;

function reducer(seed, callSite) {
    if (typeof callSite == 'string') {
        if (callSite != seed[seed.length -1]) seed.push(callSite);
        return seed;
    }
    var name = callSite && callSite.getFileName();
    if (name && !~name.indexOf('node_modules') && ~name.indexOf(sep)) seed.push(callSite);
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
    lines.push("    at " + line);
  }
  return lines.join("\n");
}