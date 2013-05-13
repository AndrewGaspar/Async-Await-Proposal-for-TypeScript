var __defer = this.__defer || require('./defer'),
    __maybeAsync = this.__maybeAsync || require('./maybeAsync');

// AND:
var __and = this.__and || function(b1, b2) {
    var def = __defer();
    __maybeAsync(b1, function (val) {
        try {
            def.resolve((val) ? b2() : val);
        } catch (e) {
            def.reject(e);
        }
    }, function (e) {
        def.reject(e);
    });
    return def.promise;
}

module.exports = __and;