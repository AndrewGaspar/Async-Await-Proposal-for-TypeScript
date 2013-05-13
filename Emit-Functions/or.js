var __getSyncEntity = this.__getSyncEntity || require('./getSyncEntity'),
    __maybeAsync = this.__maybeAsync || require('./maybeAsync');

// OR:
var __or = this.__or || function(b1, b2) {
    var ent = __getSyncEntity();
    __maybeAsync(b1, function (val) {
        try {
            ent.resolve((val) ? val : b2());
        } catch (e) {
            ent.reject(e);
        }
    }, function (e) {
        ent.reject(e);
    });
    return ent.getReturn();
}

module.exports = __or