# Async/Await Proposal for TypeScript

The TypeScript team is investigating
[Async/Await](https://typescript.codeplex.com/wikipage?title=Roadmap&referringTitle=Home). 
What follows is a proposal for how Async/Await should be implemented. It embraces the widely accepted community standard
for syntactically sane asynchronous programming: [Promises/A+ spec](http://promises-aplus.github.io/promises-spec/).
By using promises as the atomic unit for async/await in TypeScript, the language taps into a large, existing set of
libraries ([Q](https://github.com/kriskowal/q), 
[WinJS](http://msdn.microsoft.com/en-us/library/windows/apps/br211867.aspx),
[DOM Futures proposal](http://dom.spec.whatwg.org/#futures), etc.), making them instantly compatible.

The need is clear - asynchronous behavior, and the handling of that behavior, can be difficult to reason about in
JavaScript. TypeScript does little currently to address this problem. The Promises/A+ spec gets us most of the way
there, making it possible to develop with asynchronous requests in a way that seems synchronous. There are still
certain things the spec alone can not handle well - using promises directly in conditional statements, `await`ing in
loops, and assigning to a typed value using both an `async` function call and synchronously, depending on a branching
statement.

## Single Statement `await`s

TODO

## `await` In Conditional Statements

TODO

## Assigning to Typed Value Synchronously and Asynchronously

TODO

## Await In Loops

TODO

