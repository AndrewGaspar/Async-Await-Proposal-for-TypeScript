var __getSyncEntity = this.__defer || require("./getSyncEntity"),
    __maybeAsync = this.__defer || require("./maybeAsync"),
    __getControlBlock = this.__getControlBlock || require("./control");

var __tryCatch = this.__tryCatch || function (__tryBlock, __continuation, _pc) {
    var ent = __getSyncEntity(),
        controlBlock = __getControlBlock(_pc);

    function afterTryAndCatch() {
        if (controlBlock.continueExecuting) handleFinally();
        else resolve((controlBlock.shouldReturn) ? controlBlock.returnValue : undefined);
    }

    function handleErrorInCatch(e) {
        __maybeAsync(function () { if (__tryBlock.__finally) return __tryBlock.__finally(); }, function () {
            rejectWithError(e);
        }, rejectWithError)
    }

    function resolve(val) {
        ent.resolve(val);
    }

    function rejectWithError(e) {
        ent.reject(e);
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
            }, resolve, rejectWithError);
        } else resolve((controlBlock.shouldReturn) ? controlBlock.returnValue : undefined);
    }

    handleTry();

    return ent.getReturn();
}

module.exports = __tryCatch; // included to allow testing