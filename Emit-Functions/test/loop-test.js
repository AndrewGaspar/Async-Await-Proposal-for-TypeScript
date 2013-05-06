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
        //function(done) {
        //    async function fac(n) {
        //        var total = 1;
        //        for(var i = 1; i <= n; i++) {
        //            total *= await __promisify(i);
        //        }
        //        return total;
        //    }

        //    fac(5).then(function(val) {
        //       if(val === 120) done();
        //       else done("No bueno."); 
        //    });
        //}

        function fac(n) {
            var total = 1;
            
            var i = 1;
            
            return __loop({
                condition: function() {
                    return i <= n;
                },
                body: function() {
                    return __promisify(i).then(function(_t) {
                       total *= _t;
                       i++; 
                    });
                }
            }, function() {
                return total;
            });
        }

        fac(5).then(function(val) {
            if(val === 120) done();
            else done(val + ''); 
        });
    })
});