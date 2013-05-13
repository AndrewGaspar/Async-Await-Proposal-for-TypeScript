var __getDeferral = this.__getDeferral || require("./getDeferral");

var __defer = this.__defer || function (deferFunction) {
    var d = __getDeferral();

    try {
        deferFunction(d);
    } catch (e) {
        d.reject(e);
    }

    return d.promise;
}

module.exports = __defer;