var __isPromise = this.__isPromise || require("./isPromise"),
    __defer = this.__defer || require("./defer");

var __rejectify = this.__rejectify || function(error) {
    var def = __defer();
    def.reject(error);
    return def.promise;
}

module.exports = __rejectify;