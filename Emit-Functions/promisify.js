var __isPromise = this.__isPromise || require("./isPromise"),
    __getDeferral = this.__getDeferral || require("./getDeferral");

var __promisify = this.__promisify || function(value) {
    if (__isPromise(value)) return value;
    var def = __getDeferral();
    def.resolve(value);
    return def.promise;
}

module.exports = __promisify;