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
        __maybeAsync((continuation) ? continuation() : undefined, function (val) {
            def.resolve(val);
        }, function (e) {
            def.reject(e);
        });
    }

    function evalCondition(truthy) {
        if (truthy) {
            if (loop.body) {
                var prom = loop.body({
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

        __maybeAsync(prom, next);
    }

    function next() {
        if (returning) {
            def.resolve(returnValue);
        } else if (breaking) {
            exitLoop();
        } else {
            if(loop.post) {
                var prom = loop.post();
            }

            __maybeAsync(prom, evaluateCondition);
        }
    }

    function evaluateCondition() {
        var conditionEvaluation = skipConditionEval || loop.condition();
        skipConditionEval = false;

        __maybeAsync(conditionEvaluation, evalCondition);
    }

    var skipConditionEval = !!(loop.isDo);

    next();

    return def.promise;
}

module.exports = __loop;