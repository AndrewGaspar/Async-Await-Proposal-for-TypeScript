module.exports = (function () {

    function isFunction(f) {
        /// <summary>http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type</summary>
        var getType = {};
        return f && getType.toString.call(f) === '[object Function]';
    }

    var deferFunction = (function () {
        if (setImmediate) return function (f) { setImmediate(f) };
        else return function (f) { setTimeout(f, 0); };
    })();

    function queueFunction(f) {
        /// TODO: Make this more robust
        deferFunction(f);
    }

    var Deferred = (function () {
        function deferred() {
            var def = this;

            this._isPending = true;
            this._isResolved = false;
            this._isRejected = false;

            this._fulfillQueue = [];
            this._rejectQueue = [];

            this.promise = {
                then: function (onFulfilled, onRejected) {
                    var _this = this;

                    var def2 = defer();

                    def._queueFulfill(function () {
                        def2.resolve(isFunction(onFulfilled) ? onFulfilled(_this._value) : _this._value);
                    });

                    def._queueReject(function () {
                        def2.reject(isFunction(onRejected) ? onRejected(_this._reason) : _this._reason);
                    });

                    return def2.promise;
                }
            }
        }

        deferred.prototype = {
            resolve: function (value) {
                var _this = this;
                (isPromise(value)) ? value.then(function (v) { _this._onResolve(v) }) : this._onResolve(value);
            },
            reject: function (reason) {
                (isPromise(reason)) ? reason.then(this._onReject) : this._onReject(reason);
            },
            _onResolve: function (val) {
                if (this._isPending) {
                    this._isResolved = true;
                    this._isPending = false;

                    this.promise._value = val;

                    this._emptyQueues();
                }
            },
            _onReject: function (rea) {
                if (this._isPending) {
                    this._isRejected = true;
                    this._isPending = false;

                    this.promise._reason = rea;

                    this._emptyQueues();
                }
            },
            _queueFulfill: function (fulfillCallback) {
                this._fulfillQueue.push(fulfillCallback);
                this._emptyQueues();
            },
            _queueReject: function (rejectCallback) {
                this._rejectQueue.push(rejectCallback);
                this._emptyQueues();
            },
            _emptyQueues: function () {
                if (!this._isPending) {
                    if (this._isResolved) {
                        for (var i = 0; i < this._fulfillQueue.length; i++) {
                            deferFunction(this._fulfillQueue[i]);
                        }
                    } else if (this._isRejected) {
                        for (var i = 0; i < this._rejectQueue.length; i++) {
                            deferFunction(this._rejectQueue[i]);
                        }
                    }

                    this._fulfillQueue = [];
                    this._rejectQueue = [];
                }
            }
        }

        return deferred;
    })();

    function defer() {
        return new Deferred();
    }

    function promisify(value) {
        var def = defer();
        def.resolve(value);
        return def.promise;
    }

    function isPromise(obj) {
        return obj && obj.then;
    }

    return {
        defer: defer,
        promisify: promisify,
        isPromise: isPromise
    }
})();