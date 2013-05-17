# Await Expressions in Compound Expressions

This section will deal with all compound expressions except those that use the `&&` or `||` operator.

Consider this expression:

```ts
async function getChildrensDiscountAsync(child: Customer, couponId: number) {
  return await getCouponValueAsync(couponId) + getMaxDiscount() + child.getAge() * -(await getDiscountRateAsync());
}
```
Although it looks like one long statement, it can be broken up into several smaller statements, looking at each
operation in turn. Binary operators will completely evaluate the left operand and then completely evaluate the right
operand. Unary operators evaluate after the expression they are modifying. By following order of operations, we can
determine the order the functions must be evaluated in.

We will first chunk up this statement according to order of operations into just the individual operations.

```ts
async function getChildrensDiscountAsync(child: Customer, couponId: number) {
  return
	(
		( 
			await getCouponValueAsync(couponId) 
			+ 
			getMaxDiscount() 
		) 
		+ 
		(
			child.getAge()
			* 
			(
				-
				( 
					await getDiscountRateAsync()
				)
			)
		)
	);
}
```

1. Look at total compound expression. This includes operations done with binary operators, unary operators, or function calls. Choose the first operand.
2. If the operand is an not awaited, execute the statement and store value in a temp variable like `__t0`. If the operand is awaited, call `.then` on the evaluation of the statement. The evaluation of the next statement will be completed following the this statement, i.e. the evaluation will be placed inside a function passed to `.then`. Return the evaluation of the operand.
3. Repeat step 2 with each subsequent operand. With nested awaited operations, nested calls to `.then` should occur.
4. Once each operand in the statement has been evaluated, return from the current context with an evaluation of the operation using the temp variables in place of the original statement.

The above example will ultimately be transformed to:
```js
function getChildrensDiscountAsync(child, couponId) {
	var _this = this;
	return __async(function() {
		return getCouponValueAsync(couponId).then(function(__t0) {
			var __t1 = getMaxDiscount();
			return __t0 + __t1;
		}).then(function(__t0) {
			var __t1 = child.getAge();
			return getDiscountRateAsync().then(function(__t2) {
				return -__t2;
			}).then(function(__t2) {
				return __t1 * __t2;
			});
		});
	});
}
```

This also works with awaits inside function calls. Note that literals can be evaluated in place since they don't have
potential side effects.

```ts
async function sayChildsDiscountAsync(): void {
  console.log("Your discount is: " + await getChildrensDiscountAsync(yourChild, yourCoupon));
}
```

Which ultimately becomes:
```js
function sayChildsDiscountAsync() {
	__async(function() {
		return getChildrensDiscountAsync(yourChild, yourCoupon).then(function(__t0) {
			console.log("Your discount is: " + __t0);
		});
	});
}
```

On an unrelated note that the function above does not return the Promise because it is marked as void. Because it does
not return a Promise, it cannot be awaited.

In summary, compound expressions can be transformed to the simpler pattern discussed in section 1. Unfortunately,
short-circuiting boolean operators will throw a wrench in the works.
