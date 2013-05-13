var __getSyncEntity = this.__getSyncEntity || require('./getSyncEntity'),
    __maybeAsync = this.__maybeAsync || require('./maybeAsync');

// AND:
var __and = this.__and || function(b1, b2) {
    var ent = __getSyncEntity();
    __maybeAsync(b1, function (val) {
        try {
            ent.resolve((val) ? b2() : val);
        } catch (e) {
            ent.reject(e);
        }
    }, function (e) {
        ent.reject(e);
    });
    return ent.getReturn();
}

module.exports = __and;