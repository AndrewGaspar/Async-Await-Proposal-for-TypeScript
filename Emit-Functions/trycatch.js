var __defer = require("./promisify").defer,
    __maybeAsync = require("./promisify").maybeAsync,
    __getControlBlock = require("./control").getControlBlock;

function __tryCatch(__try, __catch, __finally, __continuation, _pc) {
    var d = __defer(),
        controlBlock = __getControlBlock(_pc);

    function afterTryAndCatch() {
        if (controlBlock.continueExecution) handleFinally();
        else d.resolve((controlBlock.shouldReturn) ? controlBlock.returnValue : undefined);
    }

    function rejectWithError(e) {
        d.reject(e);
    }

    function handleTry() {
        __maybeAsync(function() { return __try(controlBlock); }, afterTryAndCatch, handleCatch);
    }

    function handleCatch(e) {
        __maybeAsync(function () { return __catch(e, controlBlock); }, afterTryAndCatch, rejectWithError);
    }

    function handleFinally() {
        __maybeAsync(function() { if(__finally) return __finally(); }, afterFinally, rejectWithError);
    }

    function afterFinally() {
        if (controlBlock.continueExecution) {
            __maybeAsync(function () {
                if (__continuation) return __continuation();
            }, function (val) {
                d.resolve(val);
            }, function (e) {
                d.reject(e);
            });
        } else d.resolve((controlBlock.shouldReturn) ? controlBlock.returnValue : undefined);
    }

    return d.promise;
}

module.exports = __tryCatch; // included to allow testing