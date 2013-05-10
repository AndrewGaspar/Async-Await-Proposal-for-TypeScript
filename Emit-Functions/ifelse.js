var __promisify = require("./promisify").promisify,
    __isPromise = require("./promisify").isPromise,
    __defer = require("./promisify").defer,
    __maybeAsync = require("./promisify").maybeAsync;



function __ifElse(conditionals, continuation, _pc) {
    var def = __defer(),
        i = 0;

    function handleIf() {
        if (i < conditionals.length) {
            var ifBlock = conditionals[i++];

            // If there is no condition and its the last block in if-else, it is an else block.
            // Condition will be true in this case. Otherwise it is the evaluation of the block's condition.
            var condition = (!ifBlock.condition) || ifBlock.condition();

            __maybeAsync(condition, function(truthy) {
                //  If the condition evaluates to true, run the body of the function then skip to the
                //  continuation. otherwise call __ifElse recursively with the first item dequeued.

                var returning = false,
                    continuing = true,
                    returnValue;

                function returnPromise() {
                    //  If ifBlock is returning or there is no continuation, the return value of the body
                    //  should be returned. Otherwise the continuation should be called and returned.

                    if(continuing) {
                        exit();
                    } else {
                        def.resolve((returning) ? returnValue : undefined);
                    }
                }

                if (truthy) {
                    __maybeAsync(ifBlock.body({
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
                    }), returnPromise);
                } else handleIf();
            });
        } else exit();
    }

    function exit() {
        __maybeAsync((continuation) ? continuation() : undefined, function (val) {
            def.resolve(val);
        }, function (e) {
            def.reject(e);
        });
    }

    handleIf();

    return def.promise;
}

module.exports = __ifElse;