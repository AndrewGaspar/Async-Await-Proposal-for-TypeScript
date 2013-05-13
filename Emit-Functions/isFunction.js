var __isFunction = this.__isFunction || function(f) {
    /// <summary>http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type</summary>
    var getType = {};
    return !!f && getType.toString.call(f) === '[object Function]';
}

module.exports = __isFunction;