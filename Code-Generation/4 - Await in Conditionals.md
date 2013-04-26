# `await` in conditionals

This section will cover all if-else blocks that contain `await` statements, either in the condition or the block of the conditional.

Consider the following function:

```ts
async function getBlogPostCount() {
  if(cachedCount) {
    var posts = await getBlogPosts();
    return (cachedCount = posts.length);
  } else {
    return cachedCount;
  }
}
```

Let's hoist our variable declaration while we're at it:

```ts
async function getBlogPostCount() {
  var posts;

  if(cachedCount) {
    posts = await getBlogPosts();
    return (cachedCount = posts.length);
  } else {
    return cachedCount;
  }
}
```

In this function, one branch results in `await` where as the other returns a value directly. We need to handle the case where this happens. A new helper function is needed!

The basic idea is that an array of `conditionals` will be passed to the arguments of `__if`. Each object will have a `condition` property that is a function that returns a value or a promise for a value and a `body` property that is a function that contains the conditional body. All objects except the last require a condition (else block). Additionally, each object will have a `shouldReturn` flag that is set to true if the statement contains a return. Finally, a promise returning `continuation` function is passed in. This represents all operations that follow the if-else block.

```ts
interface __conditional {
  condition: () => any; // can be promise, but not required
  body: () => any; // can be Promise, but not required
  shouldReturn?: boolean;
}

interface __ifElse {
  (conditionals: __conditional[], continuation: () => any): Promise;
}
```

```js
function __ifElse(conditionals, continuation) {
  if(!conditionals.length) return __promisify(); // if none of the blocks evaluated to true, return true.
  
  var ifBlock = conditionals[0];
  if(conditionals.length === 1 && !ifBlock.condition) return __promisify(ifBlock.body());
  
  return __promisify(ifBlock.condition()).then(function(truthy) {
    if(truthy) {
      return __promisify(ifBlock.body()).then(function(value) {
        if(!ifBlock.shouldReturn) {
          return __promisify(continuation());
        } else return;
      });
    }
    else return __ifElse(conditionals.slice(1, conditionals.length));
  });
}
```

Transforming our example above:
```js
function getBlogPostCount() {
  var posts;
  
  return __ifElse(
    [
      {
        condition: function() { return cachedCount; },
        body: function() { 
            return getBlogPosts().then(function(_0) {
              posts = _0;
              return (cachedCount = posts.length);
            });
          },
        shouldReturn: true
      },
      {
        body: function() { return cachedCount; },
        shouldReturn: true
      }
    ]
  );
}
```

This example is easy because all code paths have a return statement. Unfortunately, things get a little hairier when only some of the 
