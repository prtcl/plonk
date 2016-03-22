
var scale = require('../math/scale'),
    metro = require('../timers/metro'),
    toNumber = require('../util/toNumber');

/**
 * An envelope that provides linear interpolation of `value` to `target` over `time`. The `callback` function is entirely optional, as it receives the same value as `.progress()`.
 *
 * Note that due to the inacurate nature of timers in JavaScript, very fast (<= 50ms) `time` values do not provide reliable results.
 * @static
 * @memberof plonk
 * @name env
 * @param {number} value
 * @param {number} target
 * @param {number} time
 * @param {function} [callback=noop]
 * @returns {promise}
 * @example
 * plonk.env(-1, 1, 100)
 *   .progress(function (val) {
 *     console.log(val);
 *     // => -1
 *     //    -0.86759346
 *     //    -0.4624115000000001
 *     //    -0.34194526000000014
 *     //    -0.23357504000000007
 *     //    ...
 *   })
 *   .then(function (val) {
 *     console.log(val);
 *     // => 1
 *   });
 */
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
