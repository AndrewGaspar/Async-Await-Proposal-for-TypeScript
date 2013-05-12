var __defer = require("./promisify").defer,
    __maybeAsync = require("./promisify").maybeAsync,
    __getControlBlock = require("./control");

function __ifElse(conditionals, continuation, _pc) {
    var def = __defer(),
        controlBlock = __getControlBlock(_pc),
        i = 0;

    function handleIf() {
        if (i < conditionals.length) {
            var ifBlock = conditionals[i++];

            // If there is no condition and its the last block in if-else, it is an else block.
            // Condition will be true in this case. Otherwise it is the evaluation of the block's condition.
            __maybeAsync(function() {
                return (!ifBlock.condition) || ifBlock.condition();
            }, function(truthy) {
                //  If the condition evaluates to true, run the body of the function then skip to the
                //  continuation. otherwise call __ifElse recursively with the first item dequeued.
                function returnPromise() {
                    //  If ifBlock is returning or there is no continuation, the return value of the body
                    //  should be returned. Otherwise the continuation should be called and returned.

                    if(controlBlock.continuing) exit();
                    else def.resolve((controlBlock.returning) ? controlBlock.returnValue : undefined);
                }

                if (truthy) {
                    __maybeAsync(function() {
                        return ifBlock.body(controlBlock);
                    }, returnPromise);
                } else handleIf();
            });
        } else exit();
    }

    function exit() {
        __maybeAsync(function() {
            return (continuation) ? continuation() : undefined;
        }, function (val) {
            def.resolve(val);
        }, function (e) {
            def.reject(e);
        });
    }

    handleIf();

    return def.promise;
}

module.exports = __ifElse;