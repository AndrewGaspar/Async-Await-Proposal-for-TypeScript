function __ifElse(conditionals, continuation, parentReturn) {
    

    function checkCondition(truthy) {
        //  If the condition evaluates to true, run the body of the function then skip to the 
        //  continuation. otherwise call __ifElse recursively with the first item dequeued.

        var returning = false,
            returnValue;

        function returnPromise() {
            //  If ifBlock is returning or there is no continuation, the return value of the body
            //  should be returned. Otherwise the continuation should be called and returned.
            return __promisify((returning || !continuation) ? returnValue : continuation());
        }

        if (truthy) {
            var bodyEval = ifBlock.body(function (value) { // block bodies call this rather than using the return keyword
                parentReturn(value);
                returnValue = value;
                returning = true;
            });
            return (__isPromise(bodyEval)) ? bodyEval.then(returnPromise) : returnPromise();
        } else return __ifElse(conditionals.slice(1, conditionals.length), continuation, parentReturn);
    }
    
    // If there are no conditions left to check, run the continuation and return a promise for it.
    if (!conditionals.length) {
        return (continuation) ? __promisify(continuation()) : undefined;
    }

    var ifBlock = conditionals[0]; // get first if block

    // If there is no condition and its the last block in if-else, it is an else block.
    // Condition will be true in this case. Otherwise it is the evaluation of the block's condition.
    var condition = (conditionals.length === 1 && !ifBlock.condition) || ifBlock.condition();

    return (__isPromise(condition)) ? condition.then(checkCondition) : checkCondition(condition);
}