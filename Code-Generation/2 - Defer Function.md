# Defer Function

Consider a defer function such as:

```ts
defer function readFileAsync(filename: string) {
    fs.readFile(filename, function(err, data) {
        if(err) reject err;
        else resolve data;
    }
}
```

This will be transformed to:

```js
function readFileAsync(filename) {
    var _this = this;
    return __defer(function(__deferred) {
        fs.readFile(filename, function(err, data) {
            if(err) __deferred.reject(err);
            else __deferred.resolve(data);
        });
    });
}
```

Notice the __deferred object passed to the internal function - this object controls the promise returned by [__defer](/Emit-Functions/defer.js). `resolve` and `reject` are just syntactic sugar on top of its methods. When resolve is called on it, the promise is fulfilled and other functions that were waiting on it can continue.