# `await` in conditionals

This section will cover all if-else blocks that contain `await` statements, either in the condition or the block of the conditional.

Consider the following function:

```ts
async function getBlogPostCount() {
  if(!cachedCount) {
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

  if(!cachedCount) {
    posts = await getBlogPosts();
    return (cachedCount = posts.length);
  } else {
    return cachedCount;
  }
}
```

In this function, one branch results in `await` where as the other returns a value directly. We need to handle the case where this happens. A new helper function is needed!

The basic idea is that an array of `conditionals` will be passed to the arguments of `__if`. Each object will have a `condition` property that is a function that returns a value or a promise for a value and a `body` property that is a function that contains the conditional body. All objects except the last require a condition (else block). Finally, a promise returning `continuation` function is passed in. This represents all operations that follow the if-else block.

```ts
interface __controlFlow {
  __return?: (value: any) => void;
  __continue?: () => void;
  __break?: () => void;
}

interface __conditional {
  condition: () => any; // can be promise, but not required
  body: () => any; // can return Promise, or void
  body: (_c: __controlFlow) => any; // allows conditions to exit early
}

interface __ifElse {
  (conditionals: __conditional[], continuation: () => any, parentControl?: __controlFlow): Promise;
}
```

To see the implementation of `__ifElse`, see [ifelse.js](/Emit-Functions/ifelse.js).

Transforming our example above:
```ts
async function getBlogPostCount() {
  var posts;
  
  return await __ifElse(
    [
      {
        condition: () => !cachedCount,
        body: async (__return) => { posts = await getBlogPosts(); __return(cachedCount = posts.length); },
      },
      {
        body: (_c) => { _c.__return(cachedCount) }
      }
    ]
  );
}
```

We already know how to compile a function like this, so we'll stop there. Notice the continuation function was
omitted since the if-else block was the last portion of the file.

This example is easy because all code paths have a return statement and there's no continuation. Unfortunately, things get a little hairier when only some of the code paths return.

```ts
async function payBill(customer, meals) {
  var totalPrice = _.reduce(await Q.all(meals.map((meal) => meal.getPrice())), (price, memo) => cost + memo);
  
  var payment = totalPrice;
  if(customer.methodOfPayment instanceof CreditCard) {
    await customer.methodOfPayment.credit(myAccount, payment);
    return;
  } else if (customer.methodOfPayment instanceof Cash) {
    payment -= (payment < customer.methodOfPayment.onHand) ? 0 : customer.methodOfPayment.onHand;
    
    customer.methodOfPayment.give(me, payment);
  }
  
  var difference = totalPrice - payment;
  var hours = difference / MINIMUM_WAGE;
  await customer.cleanDishes(hours);
}
```

Transforming this as in the first example, we get:

```ts
async function payBill(customer, meals) {
  var totalPrice, payment, difference, hours;
  
  totalPrice = _.reduce(await Q.all(meals.map((meal) => meal.getPrice())), (price, memo) => cost + memo);
  
  payment = totalPrice;
  return await __ifElse(
    [
      {
        condition: () => customer.methodOfPayment instanceof CreditCard,
        body: async (_c) => { 
          await customer.methodOfPayment.credit(myAccount, payment); 
          _c.__return(); 
        }
      },
      {
        condition: () => customer.methodOfPayment instanceof Cash,
        body: () => {
          payment -= (payment < customer.methodOfPayment.onHand) ? 0 : customer.methodOfPayment.onHand;
    
          customer.methodOfPayment.give(me, payment);
        }
      }
    ], async () => {
      var difference = totalPrice - payment;
      var hours = difference / MINIMUM_WAGE;
      await customer.cleanDishes(hours);
    });
}
```

Again, we know how to reduce this at this point, so we will leave it here.
