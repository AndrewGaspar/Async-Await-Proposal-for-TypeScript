var __promisify = require("../promisify"),
    __isPromise = require("../isPromise"),
    __and = require("../and"),
    __or = require("../or"),
    __ifElse = require("../ifElse"),
    assert = require("assert");

describe("Branching with no returns", function () {
    it("Should only run first condition", function (done) {
        var a, b, c;

        __ifElse([{
            condition: function () {
                return true;
            },
            body: function () {
                a = true;
            }
        }, {
            condition: function () {
                return true;
            },
            body: function () {
                b = true;
            }
        }, {
            body: function () {
                c = true;
            }
        }], function () {
            if (a && !b && !c) done();
            else done("Did it wrong.")
        });
    });

    it("should wait on condition promise to fulfill", function () {
        var a, b, c;

        __ifElse([{
            condition: function () {
                return __promisify(true);
            },
            body: function () {
                a = true;
            }
        }, {
            condition: function () {
                return true;
            },
            body: function () {
                b = true;
            }
        }, {
            body: function () {
                c = true;
            }
        }], function () {
            if (a && !b && !c) done();
            else done("Did it wrong.")
        });
    });

    it("conditions should only evaluate as needed", function () {
        var x = 0, a, b, c;

        __ifElse([{
            condition: function () {
                x += 2;
                return __promisify(true);
            },
            body: function () {
                a = true;
            }
        }, {
            condition: function () {
                x += 3;
                return true;
            },
            body: function () {
                b = true;
            }
        }, {
            body: function () {
                c = true;
            }
        }], function () {
            if (a && !b && !c && x === 2) done();
            else done("Did it wrong.")
        });
    });

    it("should return a promise that fulfills on completion of continuation", function (done) {

        //function (done) {
        //    var a, b, c;
        //    var prom = (async function (done) {
        //        if(await __promisify(18)) {
        //            a = true;
        //        } else {
        //            b = true;
        //        }

        //        c = true;
        //    })();

        //    if (__isPromise(prom)) {
        //        prom.then(function () {
        //            if (a && !b && c) done();
        //            else done("The correct branches weren't run.")
        //        });
        //    } else {
        //        done("ifElse did not return a promise");
        //    }
        //}

        var a, b, c;

        var prom = (function () {
            return __ifElse([{
                condition: function () {
                    return __promisify(18);
                },
                body: function () {
                    a = true;
                }
            }, {
                body: function () {
                    b = true;
                }
            }], function () {
                c = true;
            });
        })();

        if (__isPromise(prom)) {
            prom.then(function () {
                if (a && !b && c) done();
                else done("The correct branches weren't run.")
            });
        } else {
            done("ifElse did not return a promise");
        }
    });

    it("should wait on the returned promise of a body", function (done) {
        //function(done) {
        //    var a, b;

        //    var prom = (async function () {
        //        if(true) {
        //            await __promisify().then(function() {
        //                a = true;
        //            });
        //        } else {
        //            b = true
        //        }
        //    })();

        //    if(__isPromise(prom)) {
        //        prom.then(function() {
        //            if(a && !b) done();
        //            else done("Correct order did not happen.")
        //        });
        //    } else {
        //        done("if else didn't return a promise");
        //    }
        //}

        var a, b;

        var prom = (function () {
            return __ifElse([
                {
                    condition: function () {
                        return true;
                    },
                    body: function () {
                        return __promisify().then(function () {
                            a = true;
                        });
                    }
                },
                {
                    body: function () {
                        b = true;
                    }
                }
            ])
        })();

        if (__isPromise(prom)) {
            prom.then(function () {
                if (a && !b) done();
                else done("Incorrect order of execution.")
            });
        } else {
            done("if else didn't return a promise");
        }
    });
});

describe("Branching with returns", function () {
    it("Should return value", function (done) {
        //function(done) {
        //    var package = await (async function() {
        //        var requestThree = __promisify(3),
        //            requestFive = __promisify(5),
        //            requestNine = __promisify(9);
        //        
        //        var total;

        //        if((total = (await requestThree + await requestFive + await requestNine)) === 17) {
        //            return {
        //                message: "Good work, Agent Ballmer.",
        //                payload: "Sweet, sweet honey."
        //            };
        //        } else {
        //            var diff = total - 17;
        //            return diff;
        //        }
        //    })();

        //    if(package.message && package.payload) done();
        //    else done("Return did not work correctly.");
        //}

        var package;

        (function () {
            var requestThree = __promisify(3),
                requestFive = __promisify(5),
                requestNine = __promisify(9),
                total, diff;

            return __ifElse([
                {
                    condition: function () {
                        var _0, _1, _2;

                        return requestThree.then(function (_t) {
                            _0 = _t;
                            return requestFive;
                        }).then(function (_t) {
                            _1 = _t;
                            return requestNine;
                        }).then(function (_t) {
                            _2 = _t;
                            return (total = _0 + _1 + _2) === 17;
                        });
                    },
                    body: function (_c) {
                        return _c.__return({
                            message: "Good work, Agent Ballmer.",
                            payload: "Sweet, sweet honey."
                        });
                    }
                }, {
                    body: function (_c) {
                        diff = total - 17;
                        return _c.__return(diff);
                    }
                }
            ]);
        })().then(function (_t) {
            package = _t;

            if (package.message && package.payload) done();
            else done("Return did not work correctly.");
        });
    });

    it("should return from second branch", function (done) {
        //function(done) {
        //    var package = await (async function() {
        //        var requestThree = __promisify(3),
        //            requestFive = __promisify(5),
        //            requestSeven = __promisify(7);
        //        
        //        var total;

        //        if((total = (await requestThree + await requestFive + await requestSeven)) === 17) {
        //            return {
        //                message: "Good work, Agent Ballmer.",
        //                payload: "Sweet, sweet honey."
        //            };
        //        } else {
        //            var diff = total - 17;
        //            return diff;
        //        }
        //    })();

        //    if(package === -2) done();
        //    else done("Return did not work correctly.");
        //}

        var package;

        (function () {
            var requestThree = __promisify(3),
                requestFive = __promisify(5),
                requestSeven = __promisify(7),
                total, diff;

            return __ifElse([
                {
                    condition: function () {
                        var _0, _1, _2;

                        return requestThree.then(function (_t) {
                            _0 = _t;
                            return requestFive;
                        }).then(function (_t) {
                            _1 = _t;
                            return requestSeven;
                        }).then(function (_t) {
                            _2 = _t;
                            return (total = _0 + _1 + _2) === 17;
                        });
                    },
                    body: function (_c) {
                        return _c.__return({
                            message: "Good work, Agent Ballmer.",
                            payload: "Sweet, sweet honey."
                        });
                    }
                }, {
                    body: function (_c) {
                        diff = total - 17;
                        return _c.__return(diff);
                    }
                }
            ]);
        })().then(function (_t) {
            package = _t;

            if (package === -2) done();
            else done("Return did not work correctly.");
        });
    });

    it("should return from sub-conditional", function (done) {
        //(async function() {
        //    var three, total = 0;

        //    if((three = await __promisify(1) + await __promisify(2)) === 3) {
        //        total += three;

        //        if(total + 2 === 5) {
        //            total += await __promisify(2);
        //            return total;
        //        }
        //    }

        //    return "nops";
        //})().then(function(total) {
        //    done((total === 5) ? undefined : "stuff don't work");
        //});

        (function () {
            var three, total = 0;

            return __ifElse([
                {
                    condition: function () {
                        var _0, _1;

                        return __promisify(1).then(function (_t) {
                            _0 = _t;
                            return __promisify(2);
                        }).then(function (_t) {
                            _1 = _t;
                            return (three = _0 + _1) === 3;
                        });
                    },
                    body: function (_c) {
                        total += three;

                        return __ifElse([
                            {
                                condition: function () {
                                    return total + 2 === 5
                                },
                                body: function (_c) {
                                    return __promisify(2).then(function (_t) {
                                        total += _t;
                                        _c.__return(total);
                                    });
                                }
                            }
                        ], undefined, _c);
                    }
                }
            ], undefined, function () {
                return "nops"
            });
        })().then(function (total) {
            done((total === 5) ? undefined : "Value got: " + total);
        });
    });
});