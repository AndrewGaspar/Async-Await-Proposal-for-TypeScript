var __deferred = this.__deferred || function() {
  return {
    
  }
}

var __defer = this.__defer || function() {
  
}

var __promise = this.__promise || function() {
  
}

var __promisify = this.__promisify || function(value) {
  if(__isPromise(value)) return value;
  else {
    return {
      then: function(onFulfilled, onRejected) {
        
        __pushEventLoop(function() {
          try {
            var x = onFulfilled(value);
            
          } catch(reason) {
            onRejected(reason);
          }
        });
      }
    };
  }
}

var __isPromise = this.__isPromise || function (obj) {
    return obj && obj.then;
}

module.exports = {
    __defer: __defer,
    __promisify: __promisify,
    __isPromise: __isPromise
}
