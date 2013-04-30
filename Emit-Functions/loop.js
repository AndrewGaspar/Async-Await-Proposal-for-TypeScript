function __loop(conditional, continuation, parentReturn, isDo) {
    var returning = false,
        returnValue;

    function next() {
        function __continue() {

        }

        function evalCondition(truthy) {
            if (truthy) {
                if(loop.body) {
                    var bodyEval = loop.body(function (value) {
                        if (parentReturn) parentReturn(value);
                        returnValue = value;
                        returning = true;
                    }, function () {
                        skipConditionEval = true;
                    });
                    return 
                }
            } else return __promisify((continuation) ? continuation() : undefined);
        }

        var conditionEvaluation = skipConditionEval || loop.condition();
        skipConditionEval = false;

        return __isPromise(conditionEvaluation) ? conditionEvaluation.then(evalCondition) : evalCondition(conditionEvaluation);
    }

    var skipConditionEval = !!isDo;

    return next();
}

module.export = __loop;