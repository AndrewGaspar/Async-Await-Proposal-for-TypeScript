function __loop(conditional, continuation, parentReturn, isDo) {
    var returning = false,
        returnValue;

    function continuing() {
        return __promisify((returning) ? returnValue : next());
    }

    function next() {
        var conditionEval = skipConditionEval || loop.condition();
        skipConditionEval = false;

        return __promisify(conditionEval).then(function (truthy) {


            if (truthy) {
                if(loop.body) {
                    var bodyEval = loop.body(function (value) {
                        if (parentReturn) parentReturn(value);
                        returnValue = value;
                        returning = true;
                    });
                    
                }
            } else return __promisify(continuation());
        });
    }

    var skipConditionEval = !!isDo;

    return next();
}