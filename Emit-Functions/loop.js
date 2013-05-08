var __promisify = require("./promisify").promisify,
    __isPromise = require("./promisify").isPromise,
    __defer = require("./promisify").defer;

function __loop(loop, continuation, parentReturn, isDo) {
    var stopFurtherExecution = false,
        breaking = false,
        def = __defer(),
        returnValue;

    function exitLoop() {
        return __promisify((continuation) ? continuation() : undefined).then(function (val) { def.resolve(val); }, function (e) { def.reject(e); });
    }

    function evalCondition(truthy) {
        if (truthy) {
            if (loop.body) {
                var prom = loop.body(function (value) { // __return
                    if (parentReturn) parentReturn(value);
                    returnValue = value;
                    stopFurtherExecution = true;
                }, function () { // __break
                    breaking = true;
                });
            }
        } else breaking = true;

        __isPromise(prom) ? prom.then(next) : next();
    }

    function next() {
        if (stopFurtherExecution) {
            def.resolve(returnValue);
        } else if (breaking) {
            exitLoop();
        } else {
            var conditionEvaluation = skipConditionEval || loop.condition();
            skipConditionEval = false;

            __isPromise(conditionEvaluation) ? conditionEvaluation.then(evalCondition) : evalCondition(conditionEvaluation);
        }
    }

    var skipConditionEval = !!isDo;

    next();

    return def.promise;
}

module.exports = __loop;