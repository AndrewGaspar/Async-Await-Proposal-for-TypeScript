var __defer = require('../promisify').defer,
    assert = require('assert');

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