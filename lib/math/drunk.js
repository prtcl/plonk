
// returns a function that performs a "drunk walk" between min and max

var constrain = require('./constrain'),
    rand = require('./rand');

module.exports = function (min, max, step) {
  min || (min = 0);
  step || (step = 0.1);
  if (arguments.length === 1) {
    max = min;
    min = 0;
  }
  var n = rand(min, max);
  return function () {
    n = constrain(n + (max * rand(-1, 1) * step), min, max);
    return n;
  };
};
