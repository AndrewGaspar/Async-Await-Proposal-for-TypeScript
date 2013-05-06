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

    function _queueAndCallBack(func, cb) {
        deferFunction(function () {
            func();
            cb();
        });
    }

    function functionQueue() {
        var funcs = [],
            i = 0,
            started = false;

        function iterator() {
            _queueAndCallBack(funcs[i++], function () {
                if (i < funcs.length) {
                    iterator();
                } else {
                    funcs = [];
                    i = 0;
                }
            });
        }

        return {
            enqueue: function (func) {
                if (isFunction(func)) {
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
                        if (isFunction(onFulfilled)) {
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
                        if (isFunction(onRejected)) {
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
                (isPromise(value)) ? value.then(function (v) { _this._onResolve(v) }, function (r) { _this._onReject(r); }) : this._onResolve(value);
            },
            reject: function (reason) {
                var _this = this;
                //(isPromise(reason)) ? reason.then(function (r) { _this._onReject(r); }) : 
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

    function promisify(value) {
        if (isPromise(value)) return value;
        var def = defer();
        def.resolve(value);
        return def.promise;
    }

    function isPromise(obj) {
        return obj && obj.then && isFunction(obj.then);
    }

    return {
        defer: defer,
        promisify: promisify,
        isPromise: isPromise
    }
})();