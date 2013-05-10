var __defer = require("./promisify").defer,
    __maybeAsync = require("./promisify").maybeAsync;

module.exports = function __switch(value, cases, continuation, _pc) {
    var def = __defer(),
        hasCase = false,
        switchValue,
        i = 0,
        returning = false,
        continuing = true,
        returnValue;

    function handleCase() {

        if (continuing && i < cases.length) {
            var caseBlock = cases[i++];

            // If there is no condition and its the last block in if-else, it is an else block.
            // Condition will be true in this case. Otherwise it is the evaluation of the block's condition.

            __maybeAsync(hasCase || (!caseBlock.value || caseBlock.value()), function (caseValue) {
                //  If the condition evaluates to true, run the body of the function then skip to the
                //  continuation. otherwise call __ifElse recursively with the first item dequeued.

                function returnPromise() {
                    //  If caseBlock is returning or there is no continuation, the return value of the body
                    //  should be returned. Otherwise the continuation should be called and returned.

                    if (continuing) {
                        exit();
                    } else {
                        def.resolve((returning) ? returnValue : undefined);
                    }
                }

                if ((hasCase = hasCase || (caseValue === switchValue))) {
                    __maybeAsync(caseBlock.body({
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
                            continuing = false;
                        }
                    }), handleCase);
                } else handleCase();
            });
        } 
        else if(returning) {
            def.resolve(returnValue);
        } else exit();
    }

    function exit() {
        __maybeAsync((continuation) ? continuation() : undefined, function (val) {
            def.resolve(val);
        }, function (e) {
            def.reject(e);
        });
    }

    __maybeAsync(value(), function(value) {
        switchValue = value;
        handleCase();
    });

    return def.promise;
}