var __isPromise = this.__isPromise || require("./isPromise"),
    __getDeferral = this.__getDeferral || require("./getDeferral");

var __rejectify = this.__rejectify || function(error) {
    var def = __getDeferral();
    def.reject(error);
    return def.promise;
}

module.exports = __rejectify;