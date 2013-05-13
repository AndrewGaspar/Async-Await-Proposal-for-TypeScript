var __getSyncEntity = this.__getSyncEntity || require("./getSyncEntity"),
    __maybeAsync = this.__maybeAsync || require("./maybeAsync"),
    __getControlBlock = this.__getControlBlock || require("./control");

var __switch = this.__switch || function (value, cases, continuation, _pc) {
    var ent = __getSyncEntity(),
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
            resolve(controlBlock.returnValue);
        } else {
            exit();
        }
    }

    function resolve(val) {
        ent.resolve(val);
    }

    function handleError(e) {
        ent.reject(e);
    }

    function exit() {
        __maybeAsync(function () {
            // only run continuation if the reason for exiting was due to 
            if (controlBlock.continueExecuting) return (continuation) ? continuation() : undefined;
        }, resolve, handleError);
    }

    __maybeAsync(function () {
        return value();
    }, function (value) {
        switchValue = value;
        next();
    }, handleError);

    return ent.getReturn();
}

module.exports = __switch;