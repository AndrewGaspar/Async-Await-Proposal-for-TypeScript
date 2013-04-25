# Await Expression

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
