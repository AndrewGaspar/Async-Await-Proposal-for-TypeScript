function __ifElse(conditionals, continuation) {
    function checkCondition(truthy) {
        //  If the condition evaluates to true, run the body of the function then skip to the 
        //  continuation. otherwise call __ifElse recursively with the first item dequeued.

        if (truthy) {
            var bodyEval = ifBlock.body();
            return (__isPromise(bodyEval)) ? bodyEval.then(returnPromise) : returnPromise();
        } else return __ifElse(conditionals.slice(1, conditionals.length), continuation);
    }

    function returnPromise(value) {
        //  If ifBlock contained a return statement or there is no continuation, the return value of the body
        //  should be returned. Otherwise the continuation promise should be returned.
        return __promisify((ifBlock.shouldReturn || !continuation) ? value : continuation());
    }
    // If there are no conditions left to check, run the continuation and return a promise for it.
    if (!conditionals.length) {
        if (continuation) return __promisify(continuation());
        return;
    }

    var ifBlock = conditionals[0]; // get first if block

    // If there is no condition and its the last block in if-else, it is an else block.
    // Condition will be true in this case. Otherwise it is the evaluation of the block's condition.
    var condition = (conditionals.length === 1 && !ifBlock.condition) || ifBlock.condition();

    return (__isPromise(condition)) ? condition.then(checkCondition) : checkCondition(condition);
}