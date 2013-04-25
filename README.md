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

## Goals
* Be able to handle all use cases covered by async/await in C#.
* Fairly readable output

## Organization
* Start with a simple syntax definition. I.e. this is how the code will look like when you write it.
* Go through each situation where the await keyword introduces complexity in implementation from most basic to most
  advanced.
* Each section will break down the syntax until it fits a pattern shown in a previous section or is valid current
  TypeScript.

An example from C#
------------------

See AsyncAwesome.cs. Notice there are a few different use cases that must be covered to consider our implementation
a success:
* `await` assignment can exist within a condition. In fact, the function can never await a task due to the branches
  taken, but still return the syncrhonously-assigned value wrapped in a task.
* Tasks can be `await`ed in a loop synchronously. The next step will not be completed until the previous iteration
  completes.
* `await`s can be performed inside of conditions or as function parameters

## Non-trivial Language Features to Preserve

* Variable declaration hoisting must remain intact.
* Binary operations
* Short-circuiting boolean operators
* Conditional Expressions
* Loops
* Try-catch

# Table of Contents
1. Expressions
  1. [Implicit Promise Interface](https://github.com/AndrewGaspar/Async-Await-Proposal-for-TypeScript/blob/master/Expressions/Implicit%20Promise%20Interface.md)
  2. [Async Function Expression](https://github.com/AndrewGaspar/Async-Await-Proposal-for-TypeScript/blob/master/Expressions/Async%20Function%20Expression.md)
  3. [Await Expression](https://github.com/AndrewGaspar/Async-Await-Proposal-for-TypeScript/blob/master/Expressions/Await%20Expression.md)
2. Code Generation
  1. [Simple Await Expression](https://github.com/AndrewGaspar/Async-Await-Proposal-for-TypeScript/blob/master/Code-Generation/Simple%20Await%20Expression.md)
  2. [Await Expressions in Compound Expressions](https://github.com/AndrewGaspar/Async-Await-Proposal-for-TypeScript/blob/master/Code-Generation/Await%20Expressions%20in%20Compound%20Expressions.md)
  3. [Await in Boolean Expressions](https://github.com/AndrewGaspar/Async-Await-Proposal-for-TypeScript/blob/master/Code-Generation/3)%20Await%20in%20Boolean%20Expressions.md)
  4. [Await in Loops](https://github.com/AndrewGaspar/Async-Await-Proposal-for-TypeScript/blob/master/Code-Generation/4)%20Await%20in%20Loops.md)
