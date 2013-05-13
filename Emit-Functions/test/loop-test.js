var __promisify = require("../promisify.js"),
    __async = require("../async"),
    __and = require("../and.js"),
    __or = require("../or.js"),
    __ifElse = require("../ifElse.js"),
    __loop = require("../loop.js"),
    assert = require("assert");

describe("Loop with no returns", function () {
    it("should fac", function (done) {
        //async function fac(n) {
        //    var total = 1;
        //    for(var i = 1; i <= n; i++) {
        //        total *= await __promisify(i);
        //    }
        //    return total;
        //}

        //fac(5).then(function(val) {
        //    if(val === 120) done();
        //    else done("No bueno."); 
        //});

        var fac = __async(function (n) {
            var total = 1;

            var i = 1;

            return __loop({
                condition: function () {
                    return i <= n;
                },
                body: function () {
                    return __promisify(i).then(function (_t) {
                        total *= _t;
                    });
                },
                post: function () {
                    i++;
                }
            }, function () {
                return total;
            });
        });

        fac(5).then(function (val) {
            if (val === 120) done();
            else done(val + '');
        });
    });

    it("awaiting condition", function (done) {
        //async function serviceJobs() {
        //    var numJobsLeft = 5;
        //    function getNumJobs() {
        //        return __promisify(numJobsLeft);
        //    }
        //    function doJob() {
        //        return __promisify().then(function() {
        //            numJobsLeft--;
        //            return Math.random();
        //        });
        //    }
        //    function publishValue(val) {
        //        // you can imagine, right?
        //    }

        //    while(await getNumJobs() > 0) {
        //        var x = await doJob();
        //        publishValue(x);
        //    }
        //}

        //serviceJobs().then(function() { done(); });

        var serviceJobs = __async(function serviceJobs() {
            var numJobsLeft = 5;
            function getNumJobs() {
                return __promisify(numJobsLeft);
            }
            function doJob() {
                return __promisify().then(function () {
                    numJobsLeft--;
                    return Math.random();
                });
            }
            function publishValue(val) {
                // you can imagine, right?
            }

            return __loop({
                condition: function () {
                    return getNumJobs().then(function (_t) {
                        return _t > 0;
                    });
                },
                body: function () {
                    var x;
                    return doJob().then(function (_t) {
                        x = _t;
                        publishValue(_t);
                    });
                }
            });
        });

        serviceJobs().then(function () { done(); });

    });
});

describe("loop with returns", function () {
    it("should return 5", function (done) {
        //(async function() {
        //    for(var i = 0; i < 10; i++) {
        //        var val = await __promisify(i);
        //        if(val === 5) return val;
        //    }
        //})().then(function(val) {
        //    if(val === 5) done();
        //    else done(val + '');
        //});

        __async(function () {
            //for(var i = 0; i < 10; i++) {
            //    var val = await __promisify(i);
            //    if(val === 5) return val;
            //}

            var i = 0;

            return __loop({
                condition: function () {
                    return i < 10;
                },
                body: function (_c) {
                    var val;

                    return __promisify(i).then(function (_t) {
                        val = _t;
                        if (val === 5) return _c.__return(val);
                    });
                },
                post: function () {
                    i++;
                }
            });
        })().then(function (val) {
            if (val === 5) done();
            else done(val + '');
        });
    });
});

describe("loop breaks", function () {
    it("should stop before reaching 10", function (done) {
        //(async function () {
        //    var total = 0;
        //    for(var i = 0; i < 10; i++) {
        //        total += await __promisify(i);
        //        if(i === 5) break;
        //    }
        //    return total;
        //}).then(function(total) {
        //   done((total === 15) ? undefined : "Total: " + total); 
        //});

        __async(function () {
            var total = 0;

            var i = 0;
            return __loop({
                condition: function () {
                    return i < 10;
                },
                body: function (_c) {
                    return __promisify(i).then(function (_t) {
                        total += _t;
                        if (i === 5) return _c.__break();
                    });
                },
                post: function () {
                    i++;
                }
            }, function () {
                return total;
            });
        })().then(function (total) {
            done((total === 15) ? undefined : "Total: " + total);
        });
    });
});

describe("loop continues", function () {
    it("should skip numbers dibisible by 3", function (done) {
        //(async function() {
        //    var total = 0;
        //    for(var i = 0; i < 10; i++) {
        //        if(i % 3 === 0) continue;
        //        total += await __promisify(i);
        //    }
        //    return total;
        //})().then(function(total) {
        //   done((total === 27) ? undefined : "Total: " + total); 
        //});

        __async(function () {
            var total = 0;

            var i = 0;
            return __loop({
                condition: function () {
                    return i < 10;
                },
                body: function (_c) {
                    if (i % 3 === 0) return _c.__continue();
                    return __promisify(i).then(function (_t) {
                        total += _t;
                    });
                },
                post: function () {
                    i++;
                }
            }, function () {
                return total;
            });
        })().then(function (total) {
            done((total === 27) ? undefined : "Total: " + total);
        });
    });
});