# Await Expressions in Compound Expressions

This section will deal with all compound expressions except those that use the `&&` or `||` operator.

Consider this expression:

```ts
async function getChildrensDiscountAsync(child: Customer, couponId: number) {
  return await getCouponValueAsync(couponId) + maxDiscount + child.getAge() * -(await getDiscountRateAsync());
}
```
We have many expressions being acted on by non-short-circuiting binary operators.

TypeScript binary operators that we will consider non-short-circuiting are:
```
*,/,%,-,<<,>>,>>>,&,^,|,+,<,>,<=,>=,==,!=,===,!==
```

We will first chunk up this statement according to order of operations into just the individual operations.

```ts
async function getChildrensDiscountAsync(child: Customer, couponId: number) {
  return ((await getCouponValueAsync(couponId) + getMaxDiscount()) + (child.getAge() * -(await getDiscountRateAsync())));
}
```

We will now execute each of these in proper order:
```ts
async function getChildrensDiscountAsync(child: Customer, couponId: number) {
  var _0 = await getCouponValueAsync(couponId);
  var _1 = getMaxDiscount();
  var _2 = _0 + _1;
  var _3 = child.getAge();
  var _4 = await getDiscountRateAsync();
  var _5 = -_4;
  var _6 = _3 * _5;
  return _2 + _6;
}
```

In order to preserve order of operations, we will evaluate all expressions that are not binary operations in order.
The binary operators listed above are the only ones we can ensure have no side effects.

In order to follow the procedure described in the previous section, we must transform the function to:

```ts
async function getChildrensDiscountAsync() {
  var _0 = getRegularPrice()
  var _0 = await getRegularPrice();
  var _1 = await getCustomerAgeAsync();
  return _0 - _1 * 0.4;
}
```

Although this seems obvious, the functions need to be listed in the correct order of evaluation. So, the function
calls on the left will be executed first. This includes synchronous expressions, too.

Using this, we can transform the function as in the previous example:
```js
function getChildrensDiscountAsync() {
  var _0, _1;
  return getRegularPriceAsync().then(function(_2) {
    _0 = _2;
    return getCustomerAgeAsync();
  }).then(function(_3)) {
    _1 = _3; 
    return _0 - _1 * 0.4;
  }
}
```
