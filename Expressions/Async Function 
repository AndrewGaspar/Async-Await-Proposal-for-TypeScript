# Async Function Expression

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

An async function defaults to a return type of `Promise<T>`. The return statements in the function can return either
an entity of type `Promise<T>` or `T`. `T` can be inferred from the return expressions in the function, just like any
other function in TypeScript.

An async function can contain zero or more `await` expressions, which are covered in the next section. If a
function is labeled as async but contains no `await` expression, it will run synchronously and the compiler will
give a warning indicating as much.
