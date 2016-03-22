
var constrain = require('./constrain'),
    rand = require('./rand'),
    toNumber = require('../util/toNumber');

// returns a function that performs a "drunk walk" between min and max

module.exports = function (min, max, step) {
  min = toNumber(min, 0);
  max = toNumber(max, 1);
  step = constrain(toNumber(step, 0.1), 0, 1);
  if (arguments.length <= 1) {
    max = min || 1;
    min = 0;
  }
  var n = rand(min, max);
  return function () {
    n = constrain(n + (max * rand(-1, 1) * step), min, max);
    return n;
  };
};
