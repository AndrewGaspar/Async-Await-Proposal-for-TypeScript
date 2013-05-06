var __promisify = require('./promisify').promisify;

// AND:
function __and(b1, b2) {
  return __promisify(b1()).then(function(_0) {
    return (_0) ? b2() : _0;
  });
}

// OR:
function __or(b1, b2) {
  return __promisify(b1()).then(function(_0){
    return (_0) ? _0 : b2();
  });
}

module.exports = {
    __and: __and,
    __or: __or
}