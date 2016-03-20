
var delay = require('../timers/delay'),
    rand = require('../math/rand');

// timer function where the interval jitters between min and max milliseconds

module.exports = function (min, max, callback) {
  min || (min = 0);
  if (arguments.length === 2) {
    max = min;
    min = 0;
  }
  return delay(rand(min, max), function (time, i, stop) {
    callback && callback(time, i, stop);
    return rand(min, max);
  });
};
