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
function getStackParsedFrames(caller) {
    var frames = getStackFrames(caller);
    var parsed = [];
    while(frames.length) {
        var frame = frames.shift();
        var part = {
            receiver: frame.getTypeName(),
            name: frame.getFunctionName(),
            file: frame.getFileName(),
            line: frame.getLineNumber(),
            column: frame.getColumnNumber()
        };
        parsed.push(part);
    }
    return parsed;
}

module.exports.extractFrames = extractFrames;
module.exports.getStackFrames = getStackFrames;
module.exports.getStackParsedFrames = getStackParsedFrames;

