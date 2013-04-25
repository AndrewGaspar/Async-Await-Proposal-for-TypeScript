# Await Expressions in Compound Expressions

This section will deal with all compound expressions except those that use the `&&` or `||` operator.

Consider this expression:

```ts
async function getChildrensDiscountAsync(child: Customer, couponId: number) {
  return await getCouponValueAsync(couponId) + maxDiscount + child.getAge() * -(await getDiscountRateAsync());
}
```
Although it looks like one long statement, it can be broken up into several smaller statements, looking at each
operation in turn. Binary operators will completely evaluate the left operand and then completely evaluate the right
operand. Unary operators evaluate after the expression they are modifying. By following order of operations, we can
determine the order the functions must be evaluated in.

We will first chunk up this statement according to order of operations into just the individual operations.

```ts
async function getChildrensDiscountAsync(child: Customer, couponId: number) {
  return ((await getCouponValueAsync(couponId) + getMaxDiscount()) + (child.getAge() * -(await getDiscountRateAsync())));
}
```

Now, for each operation that contains an `await` keyword, we will execute each function in order and store the output
of each to a local variable before evaluating the final expression. See this in the next example:

```ts
async function getChildrensDiscountAsync(child: Customer, couponId: number) {
  var _0 = await getCouponValueAsync(couponId);
  var _1 = getMaxDiscount();
  var _2 = _0 + _1; // addition of coupon value and max discount
  var _3 = child.getAge();
  var _4 = await getDiscountRateAsync();
  var _5 = -_4; // negative of discount rate
  var _6 = _3 * _5; // reduction of discount based on age
  return _2 + _6; // discount less reduction
}
```

Which will ultimately be transformed to:
```js
function getChildrensDiscountAsync(child, couponId) {
  var _0, _1, _2, _3, _4, _5, _6;
  
  return getCouponValueAsync(couponId).then(function(_7) {
    _0 = _7;
    _1 = getMaxDiscount();
    _2 = _0 + _1; // addition of coupon value and max discount
    _3 = child.getAge();
    return getDiscountRateAsync();
  }).then(function(_8) {
    _4 = _8;
    _5 = -_4; // negative of discount rate
    _6 = _3 * _5; // reduction of discount based on age
    return _2 + _6; // discount less reduction
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

Which transforms to:
```ts
async function sayChildsDiscountAsync(): void {
  var _0 = await getChildrensDiscountAsync(yourChild, yourCoupon);
  var _1 = "Your discount is: " + _0;
  console.log(_1);
}
```

Which ultimately becomes:
```js
function sayChildsDiscountAsync() {
  var _0, _1;
  getChildrensDiscountAsync(yourChild, yourCoupon).then(function(_2) {
    _0 = _2;
    _1 = "Your discount is: " + _0;
    console.log(_1);
  })
}
```

On an unrelated note that the function above does not return the Promise because it is marked as void. Because it does
not return a Promise, it cannot be awaited.

In summary, compound expressions can be transformed to the simpler pattern discussed in section 1. Unfortunately,
short-circuiting boolean operators will throw a wrench in the works.
