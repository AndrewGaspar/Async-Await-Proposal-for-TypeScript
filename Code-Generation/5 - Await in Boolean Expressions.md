# `await` In Boolean Expressions

As with all things, there's an exception to the previous rule: Boolean expressions.

Boolean expressions short circuit in TypeScript. For example, if the first operand of the `&&` operator is falsy, it will return immediately with the value of that operand.

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
	return __async(function() {
		return user.canComment().then(function(__t0) {
			return currentPost.hasCommentsEnabled(function(__t1) {
				return __t0 && __t1;
			});
		});
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

To 

This is a pattern that looks familiar enough!
```js
function shouldIGiveAMouseACookie() {
	var can, could, should, would;

	return __async(function() {
		return __or(
			function() { 
				return __and(
					function() { return x(); }, 
					function() { return y(); });
			}, 
			function() { return z(); }
		).then(function(__t0) {
			can = __t0;
			return __and(
				function() {
					return __or(
						function() { return a(); }, 
						function() { return b(); });
				}, 
				function() { return c(); });
		}).then(function(__t0) {
			could = __t0;
			return __and(
				function() { return d(); }, 
				function() { return f(); });
		}).then(function(__t0){
			should = __t0;
			return __or(
				function() { return q(); },
				function() { return u(); });
		}).then(function(__t0) {
			would = __t0;
			return can && could && should && would;
		});
	}
}
```
