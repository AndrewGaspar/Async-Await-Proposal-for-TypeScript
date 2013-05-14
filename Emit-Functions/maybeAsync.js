var __isPromise = this.__isPromise || require("./isPromise");

var __maybeAsync = this.__maybeAsync || function(maybeReturnsPromise, handleResult, handleError) {
    /// <summary>Invokes handleResult immediately if maybePromise is not a promise with value of maybePromise.
    /// Otherwise calls handle result with fulfillment value of maybePromise.</summary>
    /// <param name='maybePromise'>A promise or regular value.</param>
    /// <param name='handleResult'>A function that operates on the value promised by maybePromise.</param>
    try {
        var maybePromise = maybeReturnsPromise();
        return __isPromise(maybePromise) ? maybePromise.then(handleResult, handleError) : handleResult(maybePromise);
    } catch (e) {
        return handleError(e);
    }
}

module.exports = __maybeAsync;