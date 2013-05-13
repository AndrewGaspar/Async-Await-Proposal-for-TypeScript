var __promisify = require("../promisify"),
    __async = require("../async"),
    __and = require("../and"),
    __or = require("../or"),
    assert = require("assert");

describe("non-promise arguments", function () {
    it("and should return first argument if it is falsey", function (done) {
        __async(function () {
            return __and(function () { return null; }, function () { return "hat"; });
        }).then(function (evaluation) {
            if (evaluation === null) done();
            else done("Not null");
        });
    });

    it("or should return first argument if it is truthy", function (done) {
        __async(function() {
            return __or(function () { return "hat"; }, function () { return "cup"; });
        }).then(function (evaluation) {
            if (evaluation === "hat") done();
            else done("Not hat");
        });
    });

    it("and should return second argument if first is truthy", function (done) {
        __async(function() {
            return __and(function () { return true; }, function () { return "hat"; });
        }).then(function (evaluation) {
            if (evaluation === "hat") done();
            else done("Not hat");
        });
    });

    it("or should return second argument if first is falsey", function (done) {
        __async(function() {
            return __or(function () { return 0; }, function () { return "hat"; });
        }).then(function (evaluation) {
            if (evaluation === "hat") done();
            else done("Not hat");
        });
    });
});

describe("promise arguments", function () {
    it("and should return first argument if it is falsey", function (done) {
        var x = 0;
        __async(function() {
            return __and(function () { x = 3; return __promisify(null); }, function () { x = 7; return "hat"; });
        }).then(function (evaluation) {
            if (evaluation === null && x === 3) done();
            else done("Not null");
        });
    });

    it("or should return first argument if it is truthy", function (done) {
        var x = 0;
        __async(function() {
            return __or(function () { x = 3; return __promisify("hat"); }, function () { x = 7; return __promisify("cup"); });
        }).then(function (evaluation) {
            if (x === 3 && evaluation === "hat") done();
            else done("Not hat");
        });
    });

    it("and should return second argument if first is truthy", function (done) {
        var x = 0;
        __async(function() {
            return __and(function () { x = 3; return __promisify({}); }, function () { x = 7; return __promisify(42); });
        }).then(function (evaluation) {
            if (x === 7 && evaluation === 42) done();
            else done("Not 42");
        });
    });

    it("or should return second argument if first is falsey", function (done) {
        var x = 0;
        __async(function() {
            return __or(function () { x = 3; return 0; }, function () { x = 7; return __promisify("hat"); });
        }).then(function (evaluation) {
            if (x === 7 && evaluation === "hat") done();
            else done("Not hat");
        });
    });
});