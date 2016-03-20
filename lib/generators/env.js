
var scale = require('../math/scale'),
    metro = require('../timers/metro'),
    toNumber = require('../util/toNumber');

// linear interpolation of value to target over time

module.exports = function (value, target, time, callback) {
  value = toNumber(value, 0);
  target = toNumber(target, 1);
  time = toNumber(time, 100);
  var elapsed = 0;
  return metro(4, function (interval, i, stop) {
    if (elapsed >= time) stop(target);
    var interpolated = scale(elapsed, 0, time, value, target);
    elapsed += interval;
    callback && callback(interpolated);
    return interpolated;
  });
};
