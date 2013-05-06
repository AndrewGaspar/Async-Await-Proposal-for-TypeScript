var __promisify = require("../promisify.js").promisify,
    __defer = require("../promisify.js").defer,
    __isPromise = require("../promisify.js").isPromise,
    __and = require("../shortcircuited.js").__and,
    __or = require("../shortcircuited.js").__or,
    __ifelse = require("../ifelse.js"),
    assert = require("assert");

describe("Branching with no returns", function () {
    it("Should only run first condition", function (done) {
        var a, b, c;

        __ifelse([{
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

        __ifelse([{
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

        __ifelse([{
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
            return __ifelse([{
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
            return __ifelse([
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

            return __ifelse([
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
                    body: function (__return) {
                        __return({
                            message: "Good work, Agent Ballmer.",
                            payload: "Sweet, sweet honey."
                        });
                    }
                }, {
                    body: function (__return) {
                        diff = total - 17;
                        __return(diff)
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

            return __ifelse([
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
                    body: function (__return) {
                        __return({
                            message: "Good work, Agent Ballmer.",
                            payload: "Sweet, sweet honey."
                        });
                    }
                }, {
                    body: function (__return) {
                        diff = total - 17;
                        __return(diff)
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
        //function(done) {
        //    var total = await (async function() {
        //        var three, total = 0;

        //        if((three = await __promisify(1) + await __promisify(2)) === 3) {
        //            total += three;

        //            if(total + 2 === 5) {
        //                total += await __promisify(2);
        //                return total;
        //            }
        //        }

        //        return "nops";
        //    })();

        //    done((total === 5) ? undefined : "stuff don't work");
        //}

        var total;
        
        (function() {
            var three, total = 0, _0, _1;

            return __ifelse([
                {
                    condition: function() {
                        var _0, _1;

                        return __promisify(1).then(function(_t) {
                            _0 = _t;
                            return __promisify(2);
                        }).then(function(_t) {
                           _1 = _t;
                           return (three =  _0 + _1) === 3;
                        });
                    },
                    body: function(__return) {
                        total += three;

                        return __ifelse([
                            {
                                condition: function() {
                                    return total + 2 === 5
                                },
                                body: function(__return) {
                                    return __promisify(2).then(function(_t) {
                                        total += _t;
                                        __return(total);
                                    });
                                }
                            }
                        ], undefined, __return);
                    }
                }
            ], undefined, function() {
                            return "nops"
                        });
        })().then(function(_t) {
            total = _t;
        })

        done((total === 5) ? undefined : "stuff don't work");
    });
});