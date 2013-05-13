var __defer = require('../defer');

describe("Promises/A+ tests", function () {
    require("promises-aplus-tests").mocha({
        pending: function () {
            var d = __defer();

            return {
                promise: d.promise,
                fulfill: function (value) { d.resolve(value); },
                reject: function (reason) { d.reject(reason); }
            }
        }
    });
});