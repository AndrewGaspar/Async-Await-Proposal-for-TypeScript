var __getControlBlock = this.__getControlBlock || (function () { 
    function ControlBlock(parentControl, dontInherit) {
        this.parent = parentControl || {};
        this.dontInherit = dontInherit || {};
        this.shouldReturn = false;
        this.shouldBreak = false;
        this.shouldContinue = false;
        this.continueExecuting = true;
    }

    ControlBlock.prototype = {
        __return: function (value) {
            if (this.parent.__return && !this.dontInherit.__return) this.parent.__return(value);
            this.returnValue = value;
            this.shouldReturn = true;
            this.continueExecuting = false;
        },
        __break: function () {
            if (this.parent.__break && !this.dontInherit.__break) this.parent.__break();
            this.shouldBreak = true;
        },
        __continue: function () {
            if (this.parent.__continue && !this.dontInherit.__continue) this.parent.__continue();
            this.shouldContinue = true;
            this.continueExecuting = false;
        }
    }

    return function (parentControl, dontInherit) {
        return new ControlBlock(parentControl, dontInherit);
    }
})();

module.exports = __getControlBlock;