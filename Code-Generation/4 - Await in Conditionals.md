# `await` in conditionals

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
  var ifBlock = condit
  for(var i = 0; i < arguments.length; i++) {
    var ifBlock = arguments[i];
    
    if(!ifBlock.condition || ifBlock.condition()) {
      
    }
  }
}
```
