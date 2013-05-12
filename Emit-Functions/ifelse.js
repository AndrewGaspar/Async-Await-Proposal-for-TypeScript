var __defer = require("./promisify").defer,
    __maybeAsync = require("./promisify").maybeAsync,
    __getControlBlock = require("./control");

function __ifElse(conditionals, continuation, _pc) {
    var def = __defer(),
        controlBlock = __getControlBlock(_pc),
        i = 0;

    function handleIf() {
        if (i < conditionals.length) {
            var conditional = conditionals[i++];

            // If there is no condition and its the last block in if-else, it is an else block.
            // Condition will be true in this case. Otherwise it is the evaluation of the block's condition.
            __maybeAsync(function() {
                return (!conditional.condition) || conditional.condition();
            }, function(truthy) {
                //  If the condition evaluates to true, run the body of the function then skip to the
                //  continuation. otherwise call __ifElse recursively with the first item dequeued.
                function returnPromise() {
                    //  If conditional is returning or there is no continuation, the return value of the body
                    //  should be returned. Otherwise the continuation should be called and returned.

                    if(controlBlock.continueExecuting) exit();
                    else def.resolve((controlBlock.shouldReturn) ? controlBlock.returnValue : undefined);
                }

                if (truthy) {
                    __maybeAsync(function() {
                        return conditional.body(controlBlock);
                    }, returnPromise);
                } else handleIf();
            }, handleError);
        } else exit();
    }

    function resolve(val) {
        def.resolve(val);
    }

    function handleError(e) {
        def.reject(e);
    }

    function exit() {
        __maybeAsync(function() {
            return (continuation) ? continuation() : undefined;
        }, resolve, handleError);
    }

    handleIf();

    return def.promise;
}

module.exports = __ifElse;