# `defer function` Expression

Defer functions are similar to async functions. Both can use the await keyword and both return promises. The difference is that defer functions intentionally askew standard function syntax to allow you to return values from non-promise returning asynchronous functions.

For example, consider a standard node.js library call:

```js
var fs = require("fs");

function getDictionary(cb) {
  fs.readFile("dictionary.txt", function(err, data) {
    if(err) {
      cb(err);
    } else {
      var words = parse(data);
      cb(null, data);
    }
  });
}

getDictionary(function(err, data) {
  if(err) handleError(err);
  else useDictionary(data);
});

```

But let's say I want to await this. I cannot because it doesn't return a promise. `defer` functions try to fix this.

```ts
import fs = module("fs");

defer function getDictionary(): Promise<string[]> {
  fs.readFile("dictionary.txt", function(err, data) {
    if(err) reject err;
    else resolve parse(data);
  });
}

(async function() {
  try {
    var dictionary = await getDictionary();
  } catch (err) {
    handleError(err);
  }
})();
```

They can also be immediately executing for those times when you only need to use the function once or you want to use internal scope.

```ts
(async function() {
  try {
    var dictionary = await (defer () => { 
      fs.readFile("dictionary.txt", (err, data) => {
        if(err) reject err;
        else resolve parse(data);
      });
    })();
  } catch(err) {
    handleError(err);
  }
})();
```

By using `defer` functions, the dev can transform other patterns into a promise returning function easily.

Firstly, in a `defer` function, the return keyword is disallowed - the return type of a `defer` function is ALWAYS a promise.

Secondly, two new keywords are introduced: `reject` and `resolve`. `reject` acts as an asynchronous `throw`. While `throw` is still allowed, it obviously only works within the scope of the `defer` function. `reject` always refers to the nearest parent `defer` function, and so can be used in nested functions beneath the `defer` function.

`resolve` is like an asynchronous return. `resolve`, like `reject`, always refers to the nearest containing `defer` function, which again essentially allows asynchronous returns from nested functions within the `defer` function. The type of the return promise is not essential and will be inferred based on your resolve statements.

`resolve` and `reject` should both immediately suspend further execution of the current context. There is no guarantee that the functions that contain `resolve` and `reject` won't be called again, but after `resolve` or `reject` have been used once, they have no further affect on the output of the function. The returned promise will always take on the state of the first use of these keywords.
