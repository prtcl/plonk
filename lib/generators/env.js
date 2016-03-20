
var scale = require('../math/scale'),
    metro = require('../timers/metro');

// linear interpolation of value to target over time

module.exports = function (value, target, time, callback) {
  if (typeof value !== 'number') value = 0;
  if (typeof target !== 'number') target = 1;
  if (typeof time !== 'number') time = 100;
  var elapsed = 0;
  return metro(4, function (t, i, stop) {
    if (elapsed >= time) stop(target);
    var interpolated = scale(elapsed, 0, time, value, target);
    elapsed += t;
    callback && callback(interpolated);
    return interpolated;
  });
};
