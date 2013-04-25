# Implicit Promise Interface
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
