# `await` In Boolean Expressions

As with all things, there's an exception to the previous rule: Boolean expressions.

Boolean expressions short circuit in TypeScript. So, if the first argument of the `&&` operator evaluates to
`false`, it will return immediately before evaluating the second portion.

For example, consider the following completely synchronous script:
```ts
var x = 0, y = 0;

function incrementX(): boolean { x++; return true; }
function decrementY(): boolean { y--; return false; }

incrementX() || decrementY(); // x = 1, y = 0
incrementX() && decrementY(); // x = 2, y = -1
decrementY() && incrementX(); // x = 2, y = -2
decrementY() || incrementX(); // x = 3, y = -3
```

This shows the need for a bit of intelligence in scripts like the following:
```ts
async function shouldUserPost(): Promise<boolean> {
  return await user.canComment() && await currentPost.hasCommentsEnabled();
}
```

If we just transform the expression like we did in the previous example, we'd get the following: 
```ts
function shouldUserPost() {
  var _0, _1;
  return user.canComment().then(function(_2) {
    _0 = _2;
    return currentPost.hasCommentsEnabled();
  }).then(function(_3) {
    _1 = _3;
    return _0 && _1;
  });
}
```

The problem with this is that `currentPost.hasCommentsEnabled()` should not be evaluated if `user.canComment()`
evaluates to a falsy value. So, we need to create a custom solution for the two short-circuiting operators:
`&&` and `||`.

Boolean expressions will be recursively divided up into individual operations and separated into async functions.
Consider the following:

```ts
async function shouldIGiveAMouseACookie() {
  var can = (await x() && y()) || await z(),
      could = (await a() || b()) && await c(),
      should = d() && await f(),
      would = q() || await u();
      
  return can && could && should && would;
}
```

The example above has an example of all 6 awaitable possibilities:
```
AND:
await b1 && b2
b1 && await b2
await b1 && await b2
```
