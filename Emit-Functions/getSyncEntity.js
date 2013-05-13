var __getDeferral = this.__getDeferral || require("./getDeferral");

var __getSyncEntity = this.__getSyncEntity || (function () {

    function SyncEntity() {
        this.isResolved = false;
        this.isRejected = false;

        this.isPending = true;
    }

    SyncEntity.prototype = {
        resolve: function (val) {
            if (this.isPending) {
                this.isResolved = true;
                this.isPending = false;

                this.resolveValue = val;

                if (this.deferred) this.deferred.resolve(this.resolveValue);
            }
        },
        reject: function (e) {
            if (this.isPending) {
                this.isRejected = true;
                this.isPending = false;

                this.reason = e;

                if (this.deferred) this.deferred.reject(this.reason);
            }
        },
        getReturn: function () {
            if (this.isResolved) return this.resolveValue;
            else if (this.isRejected) throw this.reason;
            else {
                this.deferred = this.deferred || __getDeferral();
                return this.deferred.promise;
            }
        }
    }

    return function () {
        return new SyncEntity();
    }
})();

module.exports = __getSyncEntity;