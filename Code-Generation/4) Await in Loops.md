# `await` In Loops

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
