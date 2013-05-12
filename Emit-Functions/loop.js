var __promisify = require("./promisify").promisify,
    __isPromise = require("./promisify").isPromise,
    __defer = require("./promisify").defer,
    __maybeAsync = require("./promisify").maybeAsync

function __loop(loop, continuation, parentReturn) {
    var returning = false,
        breaking = false,
        def = __defer(),
        returnValue;

    function exitLoop() {
        __maybeAsync(function() {
            return (continuation) ? continuation() : undefined;
        }, function (val) {
            def.resolve(val);
        }, function (e) {
            def.reject(e);
        });
    }

    function evalCondition(truthy) {
        __maybeAsync(function() {
            if (truthy) {
                if (loop.body) {
                    return loop.body({
                        __return: function (value) { // __return
                            if (parentReturn) parentReturn(value);
                            returnValue = value;
                            returning = true;
                        }, 
                        __break: function () { // __break
                            breaking = true;
                        },
                        __continue: function() {} // shouldn't need to do anything?
                    });
                }
            } else breaking = true;
        }, next);
    }

    function next() {
        if (returning) {
            def.resolve(returnValue);
        } else if (breaking) {
            exitLoop();
        } else {
            __maybeAsync(function () {
                if (loop.post) return loop.post();
            }, evaluateCondition);
        }
    }

    function evaluateCondition() {
        __maybeAsync(function () {
            var conditionEvaluation = skipConditionEval || loop.condition();
            skipConditionEval = false;
            return conditionEvaluation
        }, evalCondition);
    }

    var skipConditionEval = !!(loop.isDo);

    next();

    return def.promise;
}

module.exports = __loop;