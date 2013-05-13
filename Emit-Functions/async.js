var __rejectify = this.__rejectify || require("./rejectify"),
    __promisify = this.__promisify || require("./promisify");

var __async = this.__async || function (asyncFunction) {
    try {
        return __promisify(asyncFunction.apply(this, arguments));
    } catch (e) { // if an uncaught exception occurs, return a promise which is rejected with the error.
        return __rejectify(e);
    }
}

module.exports = __async;