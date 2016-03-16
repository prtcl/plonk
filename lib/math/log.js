
var constrain = require('./constrain');

// poor mans logarithmic map

module.exports = function (n) {
  return Math.pow(constrain(n, 0, 1), Math.E);
};
