var __defer = this.__defer || require('./defer'),
    __maybeAsync = this.__maybeAsync || require('./maybeAsync');

// OR:
var __or = this.__or || function(b1, b2) {
    var def = __defer();
    __maybeAsync(b1, function (val) {
        try {
            def.resolve((val) ? val : b2());
        } catch (e) {
            def.reject(e);
        }
    }, function (e) {
        def.reject(e);
    });
    return def.promise;
}

module.exports = __or