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

The basic idea is that an array of objects will be passed to the arguments of `__if`. Each object will have a `condition` property that is a function that returns a value or a promise for a value and a `body` property that is a function that contains the conditional body. All objects except the last require a condition (else block).

```js
function __ifElse(conditionBlocks) {
  if(!conditionBlocks.length) return __promisify(); // if none of if statements ran return promise
  
  var ifBlock = conditionBlocks[0];
  if(conditionBlocks.length === 1) return __promisify(ifBlock.body());
  
  return __promisify(ifBlock.condition()).then(function(truthy) {
    if(truthy) {
      return __promisify(ifBlock.body()).then(function(value) {
        
      });
    }
    else return __ifElse(conditionBlocks.slice(1, conditionBlocks.length));
  });
}
```

Transforming our example above:
```
async function getBlogPostCount() {
  var posts;
  
  return __ifElse(
    [
      {
        condition: () => cachedCount,
        body: async () => 
          { 
            posts = await getBlogPosts();
            return (cachedCount = posts.length);
          }
      },
      {
        body: () => cachedCount
      }
    ]
  );
}
```
