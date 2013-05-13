var __isFunction = this.__isFunction || require("./isFunction"),
    __isPromise = this.__isPromise || require("./isPromise");

var __defer = this.__defer || (function () {    
    var deferFunction = (function () {
        if (setImmediate) return function (f) { setImmediate(f) };
        else return function (f) { setTimeout(f, 0); };
    })();

    function functionQueue() {
        var funcs = [],
            started = false;

        function iterator() {
            deferFunction(function () {
                for (var i = 0; i < funcs.length; i++) funcs[i]();
                funcs = [];
            });
        }

        return {
            enqueue: function (func) {
                if (__isFunction(func)) {
                    funcs.push(func);
                    if (started && funcs.length === 1) {
                        iterator();
                    }
                }
            },
            start: function () {
                if (!started) {
                    started = true;
                    if (funcs.length > 0) iterator();
                }
            }
        }
    }

    var Deferred = (function () {
        function deferred() {
            var def = this;

            this._isPending = true;
            this._isResolved = false;
            this._isRejected = false;

            this._fulfillQueue = functionQueue();
            this._rejectQueue = functionQueue();

            this.promise = {
                then: function (onFulfilled, onRejected) {
                    var _this = this;

                    var def2 = defer();

                    def._queueFulfill(function () {
                        if (__isFunction(onFulfilled)) {
                            try {
                                var result = onFulfilled(_this._value);
                                def2.resolve(result);
                            } catch (e) {
                                def2.reject(e);
                            }
                        } else {
                            def2.resolve(_this._value);
                        }
                    });

                    def._queueReject(function () {
                        if (__isFunction(onRejected)) {
                            try {
                                var error = onRejected(_this._reason);
                                def2.resolve(error);
                            } catch (e) {
                                def2.reject(e);
                            }
                        } else {
                            def2.reject(_this._reason);
                        }
                    });

                    return def2.promise;
                }
            }
        }

        deferred.prototype = {
            resolve: function (value) {
                var _this = this;
                (__isPromise(value)) ? value.then(function (v) { _this._onResolve(v) }, function (r) { _this._onReject(r); }) : this._onResolve(value);
            },
            reject: function (reason) {
                var _this = this;
                this._onReject(reason);
            },
            _onResolve: function (val) {
                if (this._isPending) {
                    this._isResolved = true;
                    this._isPending = false;

                    this.promise._value = val;

                    this._rejectQueue = null;
                    this._fulfillQueue.start();
                }
            },
            _onReject: function (rea) {
                if (this._isPending) {
                    this._isRejected = true;
                    this._isPending = false;

                    this.promise._reason = rea;

                    this._fulfillQueue = null;
                    this._rejectQueue.start();
                }
            },
            _queueFulfill: function (fulfillCallback) {
                if (this._fulfillQueue) this._fulfillQueue.enqueue(fulfillCallback);
            },
            _queueReject: function (rejectCallback) {
                if (this._rejectQueue) this._rejectQueue.enqueue(rejectCallback);
            }
        }

        return deferred;
    })();

    function defer() {
        return new Deferred();
    }

    return defer;
})();

module.exports = __defer;