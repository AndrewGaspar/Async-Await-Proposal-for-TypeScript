var __promisify = require('../promisify').promisify,
    __defer = require('../promisify').defer,
    assert = require('assert');

describe("promisify", function () {
    it("should exist", function () {
        assert(__promisify);
    });
});

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