var __defer = require("./promisify").defer,
    __maybeAsync = require("./promisify").maybeAsync,
    __getControlBlock = require("./control").getControlBlock;

function __tryCatch(__try, __catch, __finally, __continuation, _pc) {
    var d = __defer(),
        controlBlock = __getControlBlock(_pc);

    function afterTryAndCatch() {
        if (controlBlock.continuing) handleFinally();
        else d.resolve((controlBlock.returning) ? controlBlock.returnValue : undefined);
    }

    function afterFinally() {
        if (controlBlock.continuing) {
            __maybeAsync((__continuation) ? __continuation() : undefined, function (val) {
                d.resolve(val);
            }, function (e) {
                d.reject(e);
            });
        } else d.resolve((controlBlock.returning) ? controlBlock.returnValue : undefined);
    }

    function rejectWithError(e) {
        d.reject(e);
    }

    function handleTry() {
        try {
            var tryPromise = __try(controlBlock);

            __maybeAsync(tryPromise, afterTryAndCatch, handleCatch);
        } catch(e) {
            handleCatch(e);
        }
    }

    function handleCatch(e) {
        try {
            var catchPromise = __catch(e, controlBlock);
            
            __maybeAsync(catchPromise, afterTryAndCatch, rejectWithError)
        } catch(e) {
            rejectWithError(e);
        }
    }

    function handleFinally() {
        try {
            if (__finally) var finallyPromise = __finally();

            __maybeAsync(finallyPromise, afterFinally, rejectWithError);
        } catch(e) {
            rejectWithError(e);
        }
    }

    function exit() {
        
    }

    return d.promise;
}

module.exports = __tryCatch; // included to allow testing