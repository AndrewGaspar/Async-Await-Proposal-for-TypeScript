function __tryCatch(__try, __catch, __finally, __continuation, __parentReturn) {
    function handleFulfilled() {
        
    }
    function handleRejected(error) {
        
    }

    function __iFinally(catchThrows) {
        /// <summary>If the finally function exists, call that. Otherwise skip to continuation depending on circumstance.</summary>

        return __promisify((function() {
            var f = (__finally) ? __finally() : null;

            if(catchThrows) return f; // if the catch block throws an exception, stop after finally
            else if(__continuation) return __isPromise(f) ? f.then(__continuation) : __continuation(); // 
        })());
    }

    var tryExec = 
        (function() { 
            var tryExec,
                wasRejected = false;

            try {
                tryExec = __try((__finally) , ); 
            } catch(e) {
                wasRejected = true;
                tryExec = handleRejected(e);
            } finally {
                if(__finally) {
                    if(wasRejected) {
                        if(__isPromise(tryExec)) {
                            tryExec = tryExec.then();
                        }
                    }
                }
            }

            return __promisify(tryExec);
        })();

    return (__isPromise(__tryExec)) ? tryExec.then(handleFulfilled, handleRejected) : ;
}

module.exports = __tryCatch; // included to allow testing