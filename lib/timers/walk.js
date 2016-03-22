
var delay = require('../timers/delay'),
    drunk = require('../math/drunk'),
    toNumber = require('../util/toNumber');

// timer function where the interval is decided by a "drunk walk" between min and max milliseconds

module.exports = function (min, max, callback) {
  min = toNumber(min, 10);
  max = toNumber(max, 100);
  if (arguments.length <= 2) {
    max = min;
    min = 0;
  }
  var d = drunk(min, max), progress;
  return delay(d(), function (time, i, stop) {
    callback && (progress = callback(time, i, stop));
    return d(progress);
  });
};
