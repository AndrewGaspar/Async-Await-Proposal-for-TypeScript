var __isFunction = this.__isFunction || require("./isFunction");

var __isPromise = this.__isPromise || function(obj) {
    return obj && obj.then && __isFunction(obj.then);
}

module.exports = __isPromise;