
var delay = require('../timers/delay'),
    rand = require('../math/rand'),
    toNumber = require('../util/toNumber');

// timer function where the interval jitters between min and max milliseconds

module.exports = function (min, max, callback) {
  min = toNumber(min, 10);
  max = toNumber(max, 100);
  if (arguments.length <= 2) {
    max = min;
    min = 0;
  }
  return delay(rand(min, max), function (interval, i, stop) {
    callback && callback(interval, i, stop);
    return rand(min, max);
  });
};
