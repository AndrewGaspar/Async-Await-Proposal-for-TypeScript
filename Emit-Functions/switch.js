var __getSyncEntity = this.__getSyncEntity || require("./getSyncEntity"),
    __maybeAsync = this.__maybeAsync || require("./maybeAsync"),
    __getControlBlock = this.__getControlBlock || require("./control");

var __switch = this.__switch || function (statement, continuation, _pc) {
    var ent = __getSyncEntity(),
        hasCase = false,
        switchValue,
        i = 0,
        controlBlock = __getControlBlock(_pc, { __break: true });

    function next() {
        if (controlBlock.continueExecuting && !controlBlock.shouldBreak && i < statement.__cases.length) {
            var caseBlock = statement.__cases[i++];

            __maybeAsync(function () {
                //  If a previous case has evaluated to true or there is no case function,
                //  return true. Otherwise, return the evaulation of the case function.

                return hasCase || (!caseBlock.__case || caseBlock.__case());
            }, function (caseValue) {
                //  If the case evaluates to true, or a previous case has evaluated to true,
                //  then execute the body if it exists.

                hasCase = hasCase || (caseValue === switchValue);
                __maybeAsync(function () {
                    if (hasCase) return caseBlock.__body && caseBlock.__body(controlBlock); // execute the body if it exists
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
            // only run continuation if the reason for exiting was due to a break
            if (controlBlock.continueExecuting) return (continuation) ? continuation() : undefined;
        }, resolve, handleError);
    }

    __maybeAsync(function () {
        return statement.__switch();
    }, function (value) {
        switchValue = value;
        next();
    }, handleError);

    return ent.getReturn();
}

module.exports = __switch;