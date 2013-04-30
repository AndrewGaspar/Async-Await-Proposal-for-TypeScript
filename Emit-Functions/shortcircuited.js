var __promisify = require('./promisify').__promisify;

// AND:
function __and(b1, b2) {
  return __promisify(b1()).then(function(_0) {
    if(_0) return b2(); // will return a promise whether or not b2 returns a promise
    else return _0;
  });
}

// OR:
function __or(b1, b2) {
  return __promisify(b1()).then(function(_0){
    if(_0) return _0;
    else return b2(); // will return a promise whether or not b2 returns a promise
  });
}

module.exports = {
    __and: __and,
    __or: __or
}