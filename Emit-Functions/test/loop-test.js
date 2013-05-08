var __promisify = require("../promisify.js").promisify,
    __defer = require("../promisify.js").defer,
    __isPromise = require("../promisify.js").isPromise,
    __and = require("../shortcircuited.js").__and,
    __or = require("../shortcircuited.js").__or,
    __ifelse = require("../ifelse.js"),
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

        function fac(n) {
            var total = 1;

            var i = 1;

            return __loop({
                condition: function () {
                    return i <= n;
                },
                body: function () {
                    return __promisify(i).then(function (_t) {
                        total *= _t;
                        i++;
                    });
                }
            }, function () {
                return total;
            });
        }

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

        function serviceJobs() {
            var numJobsLeft = 5;
            function getNumJobs() {
                return __promisify(numJobsLeft);
            }
            function doJob() {
                return __promisify().then(function() {
                    numJobsLeft--;
                    return Math.random();
                });
            }
            function publishValue(val) {
                // you can imagine, right?
            }

            return __loop({
                condition: function() {
                    return getNumJobs().then(function(_t) {
                        return _t > 0;
                    });
                },
                body: function() {
                    var x;
                    return doJob().then(function(_t) {
                        x = _t;
                        publishValue(_t);
                    });
                }
            });
        }

        serviceJobs().then(function() { done(); });

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

        (function() {
            //for(var i = 0; i < 10; i++) {
            //    var val = await __promisify(i);
            //    if(val === 5) return val;
            //}

            var i = 0;

            return __loop({
                condition: function() {
                    return i < 10;
                },
                body: function (__return) {
                    var val;

                    return __promisify(i).then(function (_t) {
                        val = _t;
                        return __ifelse([{
                            condition: function () {
                                return val === 5;
                            },
                            body: function (__return) {
                                __return(val);
                            }
                        }], function () {
                            i++;
                        }, __return);
                    });
                }
            });
        })().then(function(val) {
            if(val === 5) done();
            else done(val + '');
        });
    });
});