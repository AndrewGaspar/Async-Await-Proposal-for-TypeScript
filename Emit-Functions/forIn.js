var __maybeAsync = this.__maybeAsync || require("./maybeAsync"),
    __loop = this.__loop || require("./loop"),
    __keys = this.__keys || require("./keys");

var __forIn = this.__forIn || function (loop, continuation, parentControl) {

    var keys, i;

    return __loop({
        initialization: function () {
            i = 0;

            var prom = loop.object();
            return __maybeAsync(loop.object, function (obj) {
                keys = __keys(obj);
            });
        },
        condition: function () {
            return i < keys.length;
        },
        body: function () {
            return loop.body(keys[i]);
        },
        post: function () {
            i++;
        }
    }, continuation, parentControl);
}

module.exports = __forIn;