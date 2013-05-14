var __getSyncEntity = this.__getSyncEntity || require("./getSyncEntity"),
    __maybeAsync = this.__maybeAsync || require("./maybeAsync"),
    __getControlBlock = this.__getControlBlock || require("./control");

var __ifElse = this.__ifElse || function (statement, continuation, _pc) {
    var ent = __getSyncEntity(),
        controlBlock = __getControlBlock(_pc),
        i = 0;

    function handleIf() {
        if (i < statement.__conditionals.length) {
            var conditional = statement.__conditionals[i++];

            // If there is a condition function, execute the condition, which may return a promise.
            // If there is no condition function, return true.
            __maybeAsync(function() {
                return (!conditional.__if) || conditional.__if();
            }, function(truthy) {
                //  If the condition evaluates to true, run the body of the function then skip to the
                //  continuation. otherwise call __ifElse recursively with the first item dequeued.
                function returnPromise() {
                    //  If conditional is returning, the return value of the body should be returned.
                    //  Otherwise, "exist" the if-else block.

                    if(controlBlock.continueExecuting) exit();
                    else resolve((controlBlock.shouldReturn) ? controlBlock.returnValue : undefined);
                }

                if (truthy) {
                    __maybeAsync(function() {
                        return conditional.__body && conditional.__body(controlBlock);
                    }, returnPromise, handleError);
                } else handleIf();
            }, handleError);
        } else exit();
    }

    function resolve(val) { ent.resolve(val); }

    function handleError(e) { ent.reject(e); }

    function exit() {
        __maybeAsync(function() {
            return (continuation) ? continuation() : undefined;
        }, resolve, handleError);
    }

    handleIf();

    return ent.getReturn();
}

module.exports = __ifElse; // for testing purposes