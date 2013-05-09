var __promisify = require("./promisify").promisify,
    __isPromise = require("./promisify.js").isPromise;


function __ifElse(conditionals, continuation, _pc) {


    function checkCondition(truthy) {
        //  If the condition evaluates to true, run the body of the function then skip to the
        //  continuation. otherwise call __ifElse recursively with the first item dequeued.

        var returning = false,
            continuing = true,
            returnValue;

        function returnPromise() {
            //  If ifBlock is returning or there is no continuation, the return value of the body
            //  should be returned. Otherwise the continuation should be called and returned.
            

            if(continuing) {
                return __promisify((continuation) ? continuation() : undefined);
            } else {
                return __promisify((returning) ? returnValue : undefined);
            }
        }

        if (truthy) {
            var bodyEval = ifBlock.body({
                __return: function (value) { // block bodies call this rather than using the return keyword
                    if (_pc && _pc.__return) _pc.__return(value);
                    returnValue = value;
                    returning = true;
                    continuing = false;
                },
                __continue: function () {
                    if (_pc && _pc.__continue) _pc.__continue();
                    continuing = false;
                },
                __break: function () {
                    if (_pc && _pc.__break) _pc.__break();
                    continuing = false;
                }
            });
            return (__isPromise(bodyEval)) ? bodyEval.then(returnPromise) : returnPromise();
        } else return __ifElse(conditionals.slice(1, conditionals.length), continuation, _pc);
    }

    // If there are no conditions left to check, run the continuation and return a promise for it.
    if (!conditionals.length) {
        return __promisify((continuation) ? continuation() : undefined);
    }

    var ifBlock = conditionals[0]; // get first if block

    // If there is no condition and its the last block in if-else, it is an else block.
    // Condition will be true in this case. Otherwise it is the evaluation of the block's condition.
    var condition = (conditionals.length === 1 && !ifBlock.condition) || ifBlock.condition();

    return (__isPromise(condition)) ? condition.then(checkCondition) : checkCondition(condition);
}

module.exports = __ifElse;