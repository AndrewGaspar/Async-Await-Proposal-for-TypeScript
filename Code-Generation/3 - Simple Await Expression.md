# Simple Await Expression

The entire basis of our transformations of async functions is based on this procedure:

1. Hoist all variable declarations.
2. Transform all structures in the async/defer function into awaitable Promise producing expressions. This code generation
   is covered in the following sections.
3. Return the Expression portion of the first AwaitExpression. The await keyword is thrown out.
4. All of the expressions following the AwaitExpression up to the next AwaitExpression will be placed inside a continuation function. `.then()` will be called on the Promise from the previous step. The continuation function will be passed as an argument to the `onFulfilled` parameter of the `.then` call. Rather than continuing to nest promise continuations, `.then` will be called on the return of the previous `.then` for any further AwaitExpressions. There are exceptions which will be dicussed in the next section.
5. Repeat step 3 through 5 until reaching the end of the function.

All following sections will focus on transforming familiar data structures into a pattern that can be evaluated using
this procedure.

Take a look at the following script:
```ts
import Q = module('q');
import _ = module('underscore');

async function getAllAuthorCommentsAsync() {
  var posts = await getBlogPostsAsync();
  var commentRequests = posts.map(post => post.getCommentsAsync());
  var authors = _.uniq(posts.map(post => post.author));
  var commentLists = await Q.all(commentRequests);
  var comments = _.flatten(commentLists);
  
  return comments.filter(comment => 
    authors.some(author => 
      author === comment.author));
}
```

This example shows the need for variable hoisting. Consider if it were reduced to the following in accordance with
the pattern of Promises.
```js
var Q = require('q');
var _ = require('underscore');

function getAllAuthorCommentsAsync() {
  return getBlogPostsAsync().then(function(posts) {
    var commentRequests = posts.map(function(post) {
      return post.getCommentsAsync();
    });
    
    var authors = _.uniq(posts.map(function(post) { 
      return post.author;
    }));
    
    return Q.all(commentRequests);
  }).then(function(commentLists) {
    var comments = _.flatten(commentLists);
    
    return comments.filter(function(comment) {
      return authors.some(function(author) {
        return author === comment.author;
      });
    });
  });
}
```

The problems with this should be evident. In the second continuation, it tries to use authors, but authors is only
defined in the first continuation. This code would fail with some sort of error stating that "undefined" does not
have method "some". This is because variable declarations are not explicitly hoisted. This code would be written
"correctly" like this:
```js
function getAllAuthorCommentsAsync() {
	var _this = this;
	return __async(function() {
		var posts, commentRequests, authors, commentLists, comments;

		return getBlogPostsAsync().then(function(__t0) {
			posts = __t0;
    
			commentRequests = posts.map(function(post) {
				return post.getCommentsAsync();
			});
    
			authors = _.uniq(posts.map(function(post) { 
				return post.author;
			}));
    
			return Q.all(commentRequests);
		}).then(function(__t0) {
			commentLists = __t0;
    
			comments = _.flatten(commentLists);
    
			return comments.filter(function(comment) {
				return authors.some(function(author) {
					return author === comment.author;
				});
			});
		});
	});
}
```

Now that we have manually hoisted all of the variable declarations in the async function, the function should operate as expected. Notice we provide a garbage name, like `__t0`, as an argument for each `onFulfilled` function. A counter must be kept of how many of these temporary references are made in the current scope. This is done because these variables are not intended to be used outside of the operation the await statement is used in (an assignment or as the argument to some other function, etc.).