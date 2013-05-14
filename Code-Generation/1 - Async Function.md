# Async Function

For reasons that will hopefully become apparent later in the spec, the body of an async function will be transformed like so:

```ts
async function doSomethingAsync(arg1: number, arg2: string) {
    // body of function
}
```

to

```js
function doSomethingAsync(arg1, arg2) {
    var _this = this;
    return __async(function() {
        // body of function
    });
}
```

The methods used to transform standard control flow statements may return (or fail) either synchronously or asynchronously. It is easy to imagine a situation where an async function containing one or more await may complete synchronously due to flow controlling statements like if-else and switch. In order to match user expectations that non-asynchronous code will be completed atomically, the [__async](/Emit-Functions/async.js) function is employed. __async will ultimately wrap the evaluation of the passed function as a promise. This means all async functions will return values representing an asynchronous operation even if the entirety of the execution was synchronous.