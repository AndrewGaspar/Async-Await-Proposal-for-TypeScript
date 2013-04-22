# Async/Await Proposal for TypeScript

The TypeScript team is investigating
[Async/Await](https://typescript.codeplex.com/wikipage?title=Roadmap&referringTitle=Home). 
What follows is a proposal for how Async/Await should be implemented. It embraces the widely accepted community standard
for syntactically sane asynchronous programming: [Promises/A+ spec](http://promises-aplus.github.io/promises-spec/).
By using promises as the atomic unit for async/await in TypeScript, the language taps into a large, existing set of
libraries ([Q](https://github.com/kriskowal/q), 
[WinJS](http://msdn.microsoft.com/en-us/library/windows/apps/br211867.aspx),
[DOM Futures proposal](http://dom.spec.whatwg.org/#futures], etc.), making them instantly compatible.

## Single Statement Awaits

TODO

## Await As Conditions

TODO

## Await In Loops

TODO

