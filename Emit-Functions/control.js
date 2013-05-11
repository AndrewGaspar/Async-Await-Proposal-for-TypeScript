function ControlBlock(parentControl, dontInherit) {
    this.parent = parentControl || {};
    this.dontInherit = dontInherit || {};
    this.returning = false;
    this.continuing = true;
}

ControlBlock.prototype = {
    __return: function (value) {
        if (this.parent.__return && !this.dontInherit.__return) this.parent.__return(value);
        this.returnValue = value;
        this.returning = true;
        this.continuing = false;
    },
    __break: function () {
        if (this.parent.__break && !this.dontInherit.__break) this.parent.__break();
        this.continuing = false;
    },
    __continue: function () {
        if (this.parent.__continue && !this.dontInherit.__continue) this.parent.__continue();
        this.continuing = false;
    }
}

function getControlBlock(parentControl, dontInherit) {
    return new ControlBlock(parentControl, dontInherit);
}

module.exports = getControlBlock;