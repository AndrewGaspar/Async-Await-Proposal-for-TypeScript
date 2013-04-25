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

The basic idea is that an array of objects will be passed to the arguments of `__if`. Each object will have a `condition` property that is a function that returns a value or a promise for a value and a `body` property that is a function that contains the conditional body. All objects except the last require a condition (else block). Additionally, each object will have a `shouldReturn` flag that is set to true if the statement contains a return.

```js
function __ifElse(conditionBlocks) {
  if(!conditionBlocks.length) return __promisify(); // if none of the blocks evaluated to true, return true.
  
  var ifBlock = conditionBlocks[0];
  if(conditionBlocks.length === 1 && !ifBlock.condition) return __promisify(ifBlock.body());
  
  return __promisify(ifBlock.condition()).then(function(truthy) {
    if(truthy) {
      return __promisify(ifBlock.body()).then(function(value) {
        return {
          value: value,
          shouldReturn: ifBlock.shouldReturn
        }
      });
    }
    else return __ifElse(conditionBlocks.slice(1, conditionBlocks.length));
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
