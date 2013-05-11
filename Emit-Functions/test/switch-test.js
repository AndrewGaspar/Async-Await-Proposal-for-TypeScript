var __switch = require("../switch.js"),
    __promisify = require("../promisify.js").promisify;

describe("Switch without promises", function () {
    it("should run two cases", function (done) {
        function twoPowUpToThree(x) {
            var out = 1;

            return __switch(
                function () {
                    return x;
                },
                [{
                    value: function () {
                        return 3;
                    },
                    body: function () {
                        out *= 2;
                    }
                },
                {
                    value: function () {
                        return 2;
                    },
                    body: function () {
                        out *= 2;
                    }
                },
                {
                    value: function () {
                        return 1;
                    },
                    body: function () {
                        out *= 2;
                    }
                }],
                function () {
                    return out;
                });
        }

        twoPowUpToThree(2).then(function (out) {
            done((out === 4) ? undefined : new Error("Power: " + out));
        });
    });

    it("should break early", function (done) {
        var a, b, c, d, e;

        (function () {
            return __switch(function () {
                return 1;
            }, [{
                value: function () {
                    return 0;
                },
                body: function () {
                    a = true;
                }
            }, {
                value: function () {
                    return 1;
                },
                body: function () {
                    b = true;
                }
            }, {
                value: function () {
                    return 2;
                },
                body: function (_c) {
                    c = true;
                    return _c.__break();
                }
            }, {
                value: function () {
                    return 3;
                },
                body: function () {
                    d = true;
                }
            }], function () {
                e = true;
            });
        })().then(function () {
            done((!a && b && c && !d && e) ? undefined : new Error("not correct execution - " + a + "," + b + "," + c + "," + d + "," + e));
        });
    });
});

describe("Switch with promises", function () {
    it("should run value function once", function (done) {
        var count = 0;

        function twoPowUpToThree(x) {
            var out = 1;

            return __switch(
                function () {
                    return x;
                },
                [{
                    value: function () {
                        count++;
                        return __promisify(3);
                    },
                    body: function () {
                        out *= 2;
                    }
                },
                {
                    value: function () {
                        return 2;
                    },
                    body: function () {
                        out *= 2;
                    }
                },
                {
                    value: function () {
                        return 1;
                    },
                    body: function () {
                        out *= 2;
                    }
                }],
                function () {
                    return out;
                });
        }

        twoPowUpToThree(2).then(function (out) {
            done((out === 4 && count === 1) ? undefined : new Error("Power: " + out));
        });
    });

    it("should return early", function (done) {
        (function () {
            return __switch(function () {
                return 1;
            }, [{
                value: function () {
                    return 0;
                },
                body: function (_c) {
                    return _c.__return(2)
                }
            }, {
                value: function () {
                    return 1;
                },
                body: function (_c) {
                    return _c.__return(1);
                }
            }, {
                value: function () {
                    return 2;
                },
                body: function (_c) {
                    return _c.__return(0);
                }
            }]);
        })().then(function (x) {
            done((x === 1) ? undefined : "Val: " + x);
        });
    });
});