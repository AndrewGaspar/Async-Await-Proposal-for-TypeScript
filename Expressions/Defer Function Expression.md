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

defer function getDictionary() {
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

By using defer functions, the dev can transform other patterns into a promise returning function easily.
