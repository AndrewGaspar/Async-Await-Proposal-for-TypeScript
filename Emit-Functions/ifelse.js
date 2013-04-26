function __ifElse(conditionals, continuation) {
    // If there are no conditions left to check, run the continuation and return a promise for it.
    if (!conditionals.length) return __promisify(continuation());

    var ifBlock = conditionals[0]; // get first if block

    // if there is only one left and there is no condition on the block, immediately run the body
    // this would be an else block
    if (conditionals.length === 1 && !ifBlock.condition) return __promisify(ifBlock.body());

    // invoke the condition
    var condition = ifBlock.condition();

    function checkCondition(truthy) {
        //  If the condition evaluates to true, run the body of the function then skip to the 
        //  continuation. otherwise call __ifElse recursively with the first item dequeued.

        if (truthy) {
            return __promisify(ifBlock.body()).then(function (value) {
                //  If this block contained a return statement, the return value of the body
                //  should be returned. Otherwise the continuation promise should be returned.
                return (ifBlock.shouldReturn) ? value : __promisify(continuation());
            });
        }
        else return __ifElse(conditionals.slice(1, conditionals.length), continuation);
    }

    if (__isPromise(condition)) {
        return condition.then(checkCondition); // wait for the condition to resolve, then evaluate it
    } else {
        return checkCondition(condition); // run function immediately.
    }
}