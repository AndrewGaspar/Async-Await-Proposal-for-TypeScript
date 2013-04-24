# Async/Await Proposal for TypeScript

The TypeScript team is investigating
[Async/Await](https://typescript.codeplex.com/wikipage?title=Roadmap&referringTitle=Home). 
What follows is a proposal for how Async/Await should be implemented. It embraces the widely accepted community
standard for syntactically sane asynchronous programming: 
[Promises/A+ spec](http://promises-aplus.github.io/promises-spec/). By using promises as the atomic unit for
async/await in TypeScript, the language taps into a large, existing set of libraries 
([Q](https://github.com/kriskowal/q), [WinJS](http://msdn.microsoft.com/en-us/library/windows/apps/br211867.aspx),
[DOM Futures proposal](http://dom.spec.whatwg.org/#futures), etc.), making them instantly compatible.

The need is clear - asynchronous behavior, and the handling of that behavior, can be difficult to reason about in
JavaScript. TypeScript does little currently to address this problem. The Promises/A+ spec gets us most of the way
there, making it possible to develop with asynchronous requests in a way that seems synchronous. There are still
certain things the spec alone can not handle well - using promises directly in conditional statements, `await`ing in
loops, and assigning to a typed value using both an `async` function call and synchronously, depending on a branching
statement.

Some goals of this proposal:
* Be able to handle all use cases covered by async/await in C#.
* Fairly readable output

Organization:
* Rather that showing the compiled JavaScript output with each TypeScript+Async/Await sample, I will show the sample
  compiled to vanilla TypeScript, hopefully to make it easier to grok. This way I don't add needless complexity by
  showing JavaScript versions of unrelated TypeScript structures, like compiled class and module expressions.

An example from C#
------------------

See AsyncAwesome.cs. Notice there are a few different use cases that must be covered to consider our implementation
a success:
* `await` assignment can exist within a condition. In fact, the function can never await a task due to the branches
  taken, but still return the syncrhonously-assigned value wrapped in a task.
* Tasks can be `await`ed in a loop synchronously. The next step will not be completed until the previous iteration
  completes.
* `await`s can be performed inside of conditions or as function parameters

## Expressions

### Implicit Promise Interface
Because we want to only `await` those values which match the Promises/A+ spec, we will be using the following
interface to judge whether the object matches the spec:

```ts
interface Promise<T> {
  then<U>(onFulfilled?: (value?: T) => U, onRejected?: (reason?: any) => any): Promise<U>;
  then<U>(onFulfilled?: (value?: T) => Promise<U>, onRejected?: (reason?: any) => any): Promise<U>;
}
```

Consider this an *implicit* interface. It does not need to be included in your code, but any value that you wish to
await on must implement this interface. The TypeScript compiler will ensure this correctness.

### Async Function Expression

Class/Interface methods, functions, and arrow function expressions can all be modified using the async keyword.

As of the TypeScript 0.9 Language Specification, functions are defined using the following expressions:

```
FunctionExpression:
  function  Identifier? CallSignature { FunctionBody  }

AssignmentExpression:
  ...
  ArrowFunctionExpression

ArrowFunctionExpression:
  ArrowFormalParameters =>  Block
  ArrowFormalParameters =>  AssignmentExpression

ArrowFormalParameters:
  CallSignature
  Identifier

CallSignature:
  TypeParameters? ( ParameterList? ) TypeAnnotation?
```

Async/Await would extend this syntax with:

```
AsyncFunctionExpression:
  async FunctionExpression
  async ArrowFunctionExpression
```

An async function can have three possible return types:
* `Promise<T>`
  * T is the return type of the function
  * Note that T can be `void` if the async function contains no return expression.
  * If the type is not specified, it will be inferred like any other function in TypeScript
* `void`
  * Must be set explicitly
  * Not recommended

`void` is provided as a possible return type to allow usage of the await keyword within functions that must not
return a value.

An async function defaults to a return type of `Promise<T>`. `T` is inferred from the return expressions in the
function, just like any other function in TypeScript.

An async function can contain zero or more `await` expressions, which are covered in the next section. If a
function is labeled as async but contains no `await` expression, it will run synchronously and the compiler will
give a warning indicating as much.

### Await Expression

`await` is only allowed within functions marked as `async`

An `await` looks like the following:

```
AwaitAssignmentExpression:
  VarExpr = AwaitExpression

AwaitExpression:
  await Expression
```

An awaited expression MUST evaluate to a `Promise<T>` type. For the `AwaitAssignmentExpression`, `VarExpr` will
receive a value of type `T`, i.e. the promised value from the Promise.

An AwaitExpression will keep any subsequent expressions from evaluating until after the awaited Promise is
fulfilled.

## Code Generation

### Non-trivial Language Features to Preserve

* Variable declaration hoisting must remain intact.
* Short circuiting boolean operators
* Conditions
* Conditional Expressions
* Loops

### Single Statement `await`s

Take a look at the following script:
```ts
async function getBlogPostsWithCommentsAsync() {
  var posts = await getBlogPostsAsync();
  
  var commentRequests = posts.map(function(post) { return post.getCommentsAsync(); });
  
  var comments = await Q.when(commentRequests);
}
```

### `await` In Boolean Expressions

TODO

The problem with boolean statements is that parts of the statements are only evaluated if they are needed to determine
the truthiness of the expression. For example, consider the following completely synchronous script:
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
if(await user.canComment() && await currentPost.hasCommentsEnabled()) {
  user.postComment(currentPost, comment);
}
```

Before we continue, we'll transform this expression to:
```ts
function condition(): Promise<boolean> {
  return await user.canComment() && await currentPost.hasCommentsEnabled();
}

if(await condition()) {
  user.postComment(currentPost, comment);
}
```

A naive solution would look something like:
```ts
function condition() {
  return user.canComment().then(function(b1) {
    return currentPost.hasCommentsEnabled().then(function(b2) {
      return b1 && b2;
    });
  });
}

condition().then(function(b) {
  user.postComment(currentPost, comment);
});
```

## Assigning to Typed Value Synchronously and Asynchronously

TODO

## `await` In Loops

TODO
While loops and for loops must both be transformed for us to reason about them in a way that aligns with the
async/await pattern.

While loops:

Valid Async/Await Code:
```ts
while(x !== "no" && y() || z()) {
  x = await getX();
}
```

Transformed Code:
```ts
function condition() {
  return x !== "no" && y() || z();
}

while(condition()) {
  x = await getX();
}
```

Similarly, for loops will be transformed as well.

Valid Async/Await Code:
```ts
for(var i = 0; i < requests.length; i++) {
  await requests[i].send();
}
```

Transformed Code:
```ts
var i = 0;

function condition() {
  i < requests.length;
}

while(condition()) {
  await requests[i].send();
  i++;
}
```
