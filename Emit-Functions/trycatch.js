var __defer = this.__defer || require("./defer"),
    __maybeAsync = this.__defer || require("./maybeAsync"),
    __getControlBlock = this.__getControlBlock || require("./control");

var __tryCatch = this.__tryCatch || function(__try, __catch, __finally, __continuation, _pc) {
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