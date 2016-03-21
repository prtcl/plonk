
var constrain = require('./constrain'),
    toNumber = require('../util/toNumber');

// poor mans exponential map

module.exports = function (n) {
  n = toNumber(n, 0);
  return Math.pow(constrain(n, 0, 1), Math.E);
};
