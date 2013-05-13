var __defer = this.__defer || require("./defer");

var __async = this.__async || function (f) {
    return function () {
        var def = __defer();

        try {
            def.resolve(f());
        } catch (e) {
            def.reject(e);
        }

        return def.promise;
    }
}

module.exports = __async;