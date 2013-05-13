var __defer = this.__defer || require("./defer"),
    __maybeAsync = this.__maybeAsync || require("./maybeAsync"),
    __getControlBlock = this.__getControlBlock || require("./control");

var __switch = this.__switch || function(value, cases, continuation, _pc) {
    var def = __defer(),
        hasCase = false,
        switchValue,
        i = 0,
        controlBlock = __getControlBlock(_pc, { __break: true });

    function next() {
        if (controlBlock.continueExecuting && !controlBlock.shouldBreak && i < cases.length) {
            var caseBlock = cases[i++];

            // If there is no condition and its the last block in if-else, it is an else block.
            // Condition will be true in this case. Otherwise it is the evaluation of the block's condition.

            __maybeAsync(function () {
                return hasCase || (!caseBlock.value || caseBlock.value());
            }, function (caseValue) {
                //  If the condition evaluates to true, run the body of the function then skip to the
                //  continuation. otherwise call __ifElse recursively with the first item dequeued.

                hasCase = hasCase || (caseValue === switchValue);
                __maybeAsync(function () {
                    if (hasCase) return caseBlock.body(controlBlock);
                }, next, handleError);
            }, handleError);
        } else if (controlBlock.shouldReturn) {
            def.resolve(controlBlock.returnValue);
        } else {
            exit();
        }
    }

    function handleError(e) {
        def.reject(e);
    }

    function exit() {
        __maybeAsync(function () {
            // only run continuation if the reason for exiting was due to 
            if(controlBlock.continueExecuting) return (continuation) ? continuation() : undefined;
        }, function (val) {
            def.resolve(val);
        }, handleError);
    }

    __maybeAsync(function () {
        return value();
    }, function (value) {
        switchValue = value;
        next();
    }, handleError);

    return def.promise;
}

module.exports = __switch;