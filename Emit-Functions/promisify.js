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

                    this._fulfillQueue.start();
                }
            },
            _onReject: function (rea) {
                if (this._isPending) {
                    this._isRejected = true;
                    this._isPending = false;

                    this.promise._reason = rea;

                    this._rejectQueue.start();
                }
            },
            _queueFulfill: function (fulfillCallback) {
                this._fulfillQueue.enqueue(fulfillCallback);
            },
            _queueReject: function (rejectCallback) {
                this._rejectQueue.enqueue(rejectCallback);
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