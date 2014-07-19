'use strict';
function getRawFrames(otp) {
    var raw_stack = %CollectStackTrace({}, otp||getRawFrames, 100); // jshint ignore:line
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
        var frame = raw_frames.shift();
        var rawPos = %FunctionGetPositionForOffset(frame.code, frame.positionCounter); // jshint ignore:line
        var script = %FunctionGetScript(frame.func); // jshint ignore:line
        var scriptLocation = script.locationFromPosition(rawPos);
        var file = script.nameOrSourceURL();
        var reciver = frame.receiver.constructor || frame.receiver;
        var item = {
            receiver: reciver.name,
            name: frame.func.name || %FunctionGetInferredName(frame.func),
            file: file,
            line: scriptLocation.line+1,
            column:scriptLocation.column+1
        };
        frames.push(item);
    }
    return frames;
}
module.exports = getStackFrames_better;
