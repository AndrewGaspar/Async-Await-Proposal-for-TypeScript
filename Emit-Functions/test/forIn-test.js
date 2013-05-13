var __forIn = this.__forIn || require("../forIn"),
    __promisify = this.__promisify || require("../promisify"),
    __async = this.__async || require("../async");

describe("synchronous", function () {
    it("should sum all keys", function (done) {
        (function () {
            return __async(function () {
                var x, sum = 0;

                return __forIn({
                    object: function () {
                        return x = {
                            a: 0,
                            b: 1,
                            c: 2
                        }
                    },
                    body: function (key) {
                        sum += x[key];
                    }
                }, function () {
                    return sum;
                });
            });
        })().then(function (sum) {
            done(sum === 3 ? undefined : new Error("Sum: " + sum));
        }, function (e) {
            done(e);
        });
    });
});

describe("asynchronous", function () {
    it("should sum all keys", function (done) {
        (function () {
            return __async(function () {
                var x, sum = 0;

                return __forIn({
                    object: function () {
                        return x = __promisify({
                            a: 0,
                            b: 1,
                            c: 2
                        });
                    },
                    body: function (key) {
                        return x.then(function (obj) {
                            sum += obj[key];
                        });
                    }
                }, function () {
                    return sum;
                });
            });
        })().then(function (sum) {
            done(sum === 3 ? undefined : new Error("Sum: " + sum));
        }, function (e) {
            done(e);
        });
    });
});