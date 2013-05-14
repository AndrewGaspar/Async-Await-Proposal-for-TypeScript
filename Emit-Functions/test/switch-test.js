var __switch = require("../switch"),
    __promisify = require("../promisify"),
    __async = require("../async");

describe("Switch without promises", function () {
    it("should run two cases", function (done) {
        function twoPowUpToThree(x) {
            return __async(function () {
                var out = 1;

                return __switch({
                    __switch: function () {
                        return x;
                    },
                    __cases: [{
                        __case: function () {
                            return 3;
                        },
                        __body: function () {
                            out *= 2;
                        }
                    },
                    {
                        __case: function () {
                            return 2;
                        },
                        __body: function () {
                            out *= 2;
                        }
                    },
                    {
                        __case: function () {
                            return 1;
                        },
                        __body: function () {
                            out *= 2;
                        }
                    }]
                },
                function () {
                    return out;
                });
            });
        }

        twoPowUpToThree(2).then(function (out) {
            done((out === 4) ? undefined : new Error("Power: " + out));
        });
    });

    it("should break early", function (done) {
        var a, b, c, d, e;

        (function () {
            return __async(function () {
                return __switch({
                    __switch: function () {
                        return 1;
                    }, 
                    __cases: [{
                        __case: function () {
                            return 0;
                        },
                        __body: function () {
                            a = true;
                        }
                    }, {
                        __case: function () {
                            return 1;
                        },
                        __body: function () {
                            b = true;
                        }
                    }, {
                        __case: function () {
                            return 2;
                        },
                        __body: function (_c) {
                            c = true;
                            return _c.__break();
                        }
                    }, {
                        __case: function () {
                            return 3;
                        },
                        __body: function () {
                            d = true;
                        }
                    }]
                }, function () {
                    e = true;
                });
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
            return __async(function () {
                var out = 1;

                return __switch({
                    __switch: function () {
                        return x;
                    },
                    __cases: [{
                        __case: function () {
                            count++;
                            return __promisify(3);
                        },
                        __body: function () {
                            out *= 2;
                        }
                    },
                    {
                        __case: function () {
                            return 2;
                        },
                        __body: function () {
                            out *= 2;
                        }
                    },
                    {
                        __case: function () {
                            return 1;
                        },
                        __body: function () {
                            out *= 2;
                        }
                    }]
                },
                function () {
                    return out;
                });
            });
        }

        twoPowUpToThree(2).then(function (out) {
            done((out === 4 && count === 1) ? undefined : new Error("Power: " + out));
        });
    });

    it("should return early", function (done) {
        (function () {
            return __async(function () {
                return __switch({
                    __switch: function () {
                        return 1;
                    }, 
                    __cases: [{
                        __case: function () {
                            return 0;
                        },
                        __body: function (_c) {
                            return _c.__return(2);
                        }
                    }, {
                        __case: function () {
                            return 1;
                        },
                        __body: function (_c) {
                            return _c.__return(1);
                        }
                    }, {
                        __case: function () {
                            return 2;
                        },
                        __body: function (_c) {
                            return _c.__return(0);
                        }
                    }]
                });
            });
        })().then(function (x) {
            done((x === 1) ? undefined : "Val: " + x);
        });
    });
});