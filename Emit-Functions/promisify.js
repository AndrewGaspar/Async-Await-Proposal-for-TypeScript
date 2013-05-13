var __isPromise = this.__isPromise || require("./isPromise"),
    __defer = this.__defer || require("./defer");

var __promisify = this.__promisify || function(value) {
    if (__isPromise(value)) return value;
    var def = __defer();
    def.resolve(value);
    return def.promise;
}

module.exports = __promisify;