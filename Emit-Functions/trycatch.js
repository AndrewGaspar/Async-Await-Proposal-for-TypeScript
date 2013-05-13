var __defer = this.__defer || require("./defer"),
    __maybeAsync = this.__defer || require("./maybeAsync"),
    __getControlBlock = this.__getControlBlock || require("./control");

var __tryCatch = this.__tryCatch || function (__tryBlock, __continuation, _pc) {
    var d = __defer(),
        controlBlock = __getControlBlock(_pc);

    function afterTryAndCatch() {
        if (controlBlock.continueExecuting) handleFinally();
        else d.resolve((controlBlock.shouldReturn) ? controlBlock.returnValue : undefined);
    }

    function handleErrorInCatch(e) {
        __maybeAsync(function () { if (__tryBlock.__finally) return __tryBlock.__finally(); }, function () {
            rejectWithError(e);
        }, rejectWithError)
    }

    function rejectWithError(e) {
        d.reject(e);
    }

    function handleTry() {
        __maybeAsync(function () { return __tryBlock.__try(controlBlock); }, afterTryAndCatch, handleCatch);
    }

    function handleCatch(e) {
        __maybeAsync(function () { return __tryBlock.__catch(e, controlBlock); }, afterTryAndCatch, handleErrorInCatch);
    }

    function handleFinally() {
        __maybeAsync(function () { if (__tryBlock.__finally) return __tryBlock.__finally(); }, afterFinally, rejectWithError);
    }

    function afterFinally() {
        if (controlBlock.continueExecuting) {
            __maybeAsync(function () {
                if (__continuation) return __continuation();
            }, function (val) {
                d.resolve(val);
            }, function (e) {
                d.reject(e);
            });
        } else d.resolve((controlBlock.shouldReturn) ? controlBlock.returnValue : undefined);
    }

    handleTry();

    return d.promise;
}

module.exports = __tryCatch; // included to allow testing