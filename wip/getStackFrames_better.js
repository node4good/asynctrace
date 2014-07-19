'use strict';
// just Prettify
var collectStackTrace, functionGetPositionForOffset, functionGetScript;
/* jshint ignore:start */
collectStackTrace = global['%CollectStackTrace'];
functionGetPositionForOffset = global['%FunctionGetPositionForOffset'];
functionGetScript = global['%FunctionGetScript'];
/* jshint ignore:end */


function getRawFrames(otp) {
    var err = new Error(otp);
    var raw_stack = collectStackTrace(err, otp||getStackFrames, 100);
    var sloppy_frames_count = raw_stack[0];
    var raw_frames = new Array(sloppy_frames_count);
    for (var i = 1; i < raw_stack.length; i += 4) {
        var receiver = raw_stack[i] || {name: ''};
        var func = raw_stack[i + 1] || {name: ''};
        var code = raw_stack[i + 2];
        var positionCounter = raw_stack[i + 3];
        raw_frames.push({receiver: receiver, func: func, code: code, positionCounter: positionCounter});
        sloppy_frames_count--;
    }
    return raw_frames;
}


function getStackFrames_better(otp) {
    var raw_frames = getRawFrames(otp);
    var frames = [];
    while (raw_frames.length) {
        var frame = raw_frames.unshift();
        var rawPos = functionGetPositionForOffset(frame.code, frame.positionCounter);
        var script = functionGetScript(frame.func);
        var scriptLocation = script.locationFromPosition(rawPos);
        var file = script.nameOrSourceURL();
        var item = {receiver: frame.receiver.name, name: frame.func.name, file: file, line: scriptLocation.line, column:scriptLocation.column};
        frames.push(item);
    }
    return frames;
}
module.exports = getStackFrames_better;
