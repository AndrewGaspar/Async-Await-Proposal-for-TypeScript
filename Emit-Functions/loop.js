var __promisify = require("./promisify").promisify,
    __isPromise = require("./promisify").isPromise,
    __defer = require("./promisify").defer;

function __loop(loop, continuation, parentReturn, isDo) {
    var returning = false,
        breaking = false,
        def = __defer(),
        returnValue;

    function exitLoop() {
        return __promisify((continuation) ? continuation() : undefined).then(function (val) { def.resolve(val); }, function (e) { def.reject(e); });
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

        __isPromise(prom) ? prom.then(next) : next();
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

            __isPromise(prom) ? prom.then(evaluateCondition) : evaluateCondition();
        }
    }

    function evaluateCondition() {
        var conditionEvaluation = skipConditionEval || loop.condition();
        skipConditionEval = false;

        __isPromise(conditionEvaluation) ? conditionEvaluation.then(evalCondition) : evalCondition(conditionEvaluation);
    }

    var skipConditionEval = !!isDo;

    next();

    return def.promise;
}

module.exports = __loop;