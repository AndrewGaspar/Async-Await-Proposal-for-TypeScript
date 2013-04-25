var __simpleTSPromises = this.__simpleTSPromises || (function() {
  function __deferred() {
  }

  function __defer() {
  }

  function __promise() {
  }

  function __promisify() {
  }
})();


var __deferred = this.__deferred || function() {
  return {
    
  }
}

var __defer = this.__defer || function() {
  
}

var __promise = this.__promise || function() {
  this.
}

var __promisify = this.__promisify || function(value) {
  if(value && value.then) return value;
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
