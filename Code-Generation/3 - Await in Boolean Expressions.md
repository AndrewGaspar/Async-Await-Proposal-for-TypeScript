# `await` In Boolean Expressions

As with all things, there's an exception to the previous rule: Boolean expressions.

Boolean expressions short circuit in TypeScript. For example, if the first operand of the `&&` operator is falsy, it will return immediately with the value of the that operand.

Consider the following completely synchronous script:
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

b1 && b2
* Async Possibilities
  * await b1 && b2
  * b1 && await b2
  * await b1 && await b2
* Possible Outcomes
  * if b1 is truthy, returns b2
  * if b1 is falsy, returns b1

b1 || b2
* Async Possibilities
  * await b1 || b2
  * b1 || await b2
  * await b1 || await b2
* Possible Outcomes
  * If b1 is truthy, returns b1
  * If b1 is falsy, returns b2

In this expression, `b1` and `b2` represent expressions. When pre-pended by await, it implies an expression evaluating to a promise. Note that all of these expressions will ultimately evaluate to a promise.

When these patterns are encountered, the each operand will be abstracted into a function returning the original expression. Then, each side will be passed into one of the two following functions that are emitted to the top of the top of the output JavaScript file as needed. Note that because two of these expressions can be evaluated before the Promise returning component is evaluated, we need a function to wrap the potential non-promise as a Promise. This function, `__promisify` is detailed in ______, and is also emitted at the top of the output JavaScript file.

```js
// AND:
function __and(b1, b2) {
  return __promisify(b1()).then(function(_0) {
    if(_0) return b2(); // will return a promise whether or not b2 returns a promise
    else return _0;
  });
}

// OR:
function __or(b1, b2) {
  return __promisify(b1()).then(function(_0){
    if(_0) return _0;
    else return b2();
  });
}
```

Let's compile our previous example step by step. We'll assume that the appropriate functions have been emitted into the file.
```ts
async function shouldIGiveAMouseACookie() {
  var can = await __or(() => __and(() => x(), () => y()), () => z()),
      could = await __and(() => __or(() => a(), () => b()), () => c()),
      should = await __and(() => d(), () => f()),
      would = await __or(() => q(), () => u());
      
  return can && could && should && would;
}
```

This is a pattern that looks familiar enough!
```js
function shouldIGiveAMouseACookie() {
  var can, could, should, would;
  
  return __or(
    function() { 
      return __and(
        function() { return x(); }, 
        function() { return y(); }
    }, 
    function() { return z(); }
  ).then(function(_0) {
    can = _0;
    return __and(
      function() {
        return __or(
          function() { return a(); }, 
          function() { return b(); });
      }, 
      function() { return c(); }
  }).then(function(_1) {
    could = _1;
    return __and(
      function() { return d(); }, 
      function() { return f(); });
  }).then(function(_2){
    should = _2;
    return __or(
      function() { return q(); },
      function() { return u(); });
  }).then(function(_3) {
    would = _3;
    return can && could && should && would;
  });
}
```
