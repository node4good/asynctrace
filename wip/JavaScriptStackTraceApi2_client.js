'use strict';
function extractFrames_better(err) {
    var x = getStackFrames_better(extractFrames_better, err);
    return x;
}




function _getRawFrames(caller, err) {
    caller = caller || _getRawFrames
    var raw_stack = %CollectStackTrace(err, caller, 100); // jshint ignore:line
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


function getStackFrames_better(caller, err) {
    err = err || {}
    var raw_frames = _getRawFrames(caller, err);
    var frames = [];
    while (raw_frames.length) {
        var frame = raw_frames.shift();
        if (!frame) continue;
        var rawPos = %FunctionGetPositionForOffset(frame.code, frame.positionCounter); // jshint ignore:line
        var script = %FunctionGetScript(frame.func); // jshint ignore:line
        var scriptLocation = script.locationFromPosition(rawPos);
        var file = script.nameOrSourceURL();
        var receiver = frame.receiver;
        if (receiver === global) receiver = { constructor: {name:''} };
        var item = {
            receiver: receiver,
            receiverCons: receiver.constructor,
            receiverName: receiver.name || receiver.constructor.name,
            name: frame.func.name || %FunctionGetInferredName(frame.func),
            file: file,
            line: scriptLocation.line+1,
            column:scriptLocation.column+1,
            toString: function () { return (this.receiverName && (this.receiverName + ' . ')) + this.name + ' (' + [this.file, this.line, this.column].join(':') + ')'; }
        };
        frames.push(item);
    }
    return frames;
}

module.exports.extractFrames = extractFrames_better;
module.exports.getStackFrames = getStackFrames_better;
module.exports.getStackParsedFrames = getStackFrames_better;

