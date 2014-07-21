'use strict';
// JavaScriptStackTraceApi
function ErrorWithCaller(caller) {
    Error.captureStackTrace(this, caller);
}
function getError(caller) {
    caller = caller || getError;
    var err = new ErrorWithCaller(caller);
    return err;
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
function extractParsedFrames(err) {
    var frames = extractFrames(err);
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

module.exports.getError = getError;
module.exports.extractFrames = extractFrames;
module.exports.extractParsedFrames = extractParsedFrames;

