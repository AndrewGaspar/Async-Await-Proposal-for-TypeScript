var __getDeferral = require('../getDeferral'),
    __rejectify = require('../rejectify');

describe("Promises/A+ tests", function () {
    require("promises-aplus-tests").mocha({
        pending: function () {
            var d = __getDeferral();

            return {
                promise: d.promise,
                fulfill: function (value) { d.resolve(value); },
                reject: function (reason) { d.reject(reason); }
            }
        }
    });
});

describe("Reject tests", function () {
    it("should call onRejected", function (done) {
        __rejectify(3).then(undefined, function (e) {
            done((e === 3) ? undefined : "Error: " + e);
        });
    })
});