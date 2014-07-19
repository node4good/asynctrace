'use strict';
module.exports = function setupForMocha(settings, setup, teardown) {
    var mochaModuleKey = Object.keys(require.cache)
        .filter(function (k) { return ~k.search(/mocha.index\.js/); })
        .pop();
    if (!mochaModuleKey) return;
    var mocha = require.cache[mochaModuleKey].exports;
    var shimmer = require('shimmer');
    var reporters = mocha.reporters.Base;
    shimmer.wrap(mocha.Runner.prototype, 'run', function (original) {
        return function () {
            var runner = original.apply(this, arguments);
            settings.useColors = reporters.useColors;
            runner.on('test', setup);
            runner.on('test end', teardown);
        };
    });
};
