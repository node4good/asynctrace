'use strict';
// JavaScriptStackTraceApi
function ErrorWithCaller(caller) {
    Error.captureStackTrace(this, caller);
}
function extractFrames(err) {
    Error.prepareStackTrace = function justStoreStackStace(error, frames) {
        error.__StackStace = frames;
        return '';
    };
    err.stack;  // jshint ignore:line
    delete Error.prepareStackTrace;
    return err.__StackStace;
}
function getStackFrames(caller) {
    caller = caller || getStackFrames;
    var err = new ErrorWithCaller(caller);
    return extractFrames(err);
}

module.exports.extractFrames = extractFrames;
module.exports.getStackFrames = getStackFrames;

