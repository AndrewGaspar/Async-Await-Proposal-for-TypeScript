var __defer = require('./promisify').defer,
    __maybeAsync = require('./promisify').maybeAsync;

// AND:
function __and(b1, b2) {
    var def = __defer();
    __maybeAsync(b1(), function (val) {
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

// OR:
function __or(b1, b2) {
    var def = __defer();
    __maybeAsync(b1(), function (val) {
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

module.exports = {
    __and: __and,
    __or: __or
}