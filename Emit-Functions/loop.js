var __getSyncEntity = this.__getSyncEntity || require("./getSyncEntity"),
    __maybeAsync = this.__maybeAsync || require("./maybeAsync"),
    __getControlBlock = this.__getControlBlock || require("./control");

var __loop = this.__loop || function (loop, continuation, _pc) {
    var ent = __getSyncEntity(),
        controlBlock = __getControlBlock(_pc, { __break: true, __continue: true });


    function start() {
        __maybeAsync(function () {
            if (loop.initialization) return loop.initialization();
        }, evaluateCondition, handleError);
    }

    function evaluateCondition() {
        __maybeAsync(function () {
            // If there is no indication that the conditionEval needs to be skipped,
            // check to see if there is a condition function. If not, return true.
            // Otherwise, evaluate loop.condition, which may or may not return a promise.
            var conditionEvaluation = skipConditionEval || (!loop.condition || loop.condition());
            skipConditionEval = false; // set to false because this is only done once, usually with do-while
            return conditionEvaluation; // return - may be promise
        }, checkCondition, handleError);
    }

    function checkCondition(truthy) {
        __maybeAsync(function () {
            if (truthy) {
                if (loop.body) {
                    return loop.body(controlBlock);
                }
            } else controlBlock.__break();
        }, next, handleError);
    }

    function next() {
        if (controlBlock.shouldReturn) {
            resolve(controlBlock.returnValue);
        } else if (controlBlock.shouldBreak) {
            exitLoop();
        } else {
            __maybeAsync(function () {
                if (loop.post) return loop.post();
            }, evaluateCondition, handleError);
        }
    }

    function resolve(val) {
        ent.resolve(val);
    }

    function handleError(e) {
        ent.reject(e);
    }

    function exitLoop() {
        __maybeAsync(function () {
            return (continuation) ? continuation() : undefined;
        }, function (val) {
            resolve(val);
        }, handleError);
    }

    var skipConditionEval = !!(loop.isDo);

    start();

    return ent.getReturn();
}

module.exports = __loop;