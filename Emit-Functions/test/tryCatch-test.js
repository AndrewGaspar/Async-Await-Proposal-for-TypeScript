var __promisify = require("../promisify"),
    __rejectify = require("../rejectify"),
    __tryCatch = require("../tryCatch"),
    __ifElse = require("../ifElse");

describe("synchronous", function () {
    it("should end execution early", function (done) {
        var a, b, c;

        (function () {
            return __tryCatch({
                __try: function () {
                    throw new Error(true);
                    a = true;
                },
                __catch: function (e) {
                    b = e.message;
                },
                __finally: function () {
                    c = true;
                }
            });
        })().then(function () {
            done((typeof a === "undefined" && b === "true" && c === true) ? undefined : "Not correct execution - " + a + "," + b + "," + c);
        }, function () {
            done("should have caught error");
        });
    });

    it("should catch from if", function (done) {
        var a, b, c, d, e;

        (function () {
            return __tryCatch({
                __try: function () {
                    a = true;
                    return __ifElse([{
                        condition: function () {
                            return true;
                        },
                        body: function () {
                            throw new Error("da");
                            b = true;
                        }
                    }], function () {
                        c = true;
                    });
                },
                __catch: function (e) {
                    if (e.message === "da") d = true;
                }
            }, function () {
                e = true;
            });
        })().then(function () {
            done((a && !b && !c && d && e) ? undefined : new Error("Derp - " + a + b + c + d + e));
        });
    });
});

describe("asynchronous", function () {
    it("should end execution early", function (done) {
        var a, b, c;

        (function () {
            return __tryCatch({
                __try: function () {
                    return __rejectify(new Error(true));
                    a = true;
                },
                __catch: function (e) {
                    b = e.message;
                },
                __finally: function () {
                    c = true;
                }
            });
        })().then(function () {
            done((typeof a === "undefined" && b === "true" && c === true) ? undefined : "Not correct execution - " + a + "," + b + "," + c);
        }, function () {
            done("should have caught error");
        });
    });

    it("should rethrow exception", function (done) {
        var a, b, c;

        (function () {
            return __tryCatch({
                __try: function () {
                    return __rejectify(new Error(true));
                    a = true;
                },
                __catch: function (e) {
                    throw e;
                    b = e.message;
                },
                __finally: function () {
                    c = true;
                }
            });
        })().then(function () {
            done("should have thrown error");
        }, function () {
            done((typeof a === "undefined" && typeof b === "undefined" && c === true) ? undefined : "Not correct execution - " + a + "," + b + "," + c);
            
        });
    });
});