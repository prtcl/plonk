
var delay = require('./delay'),
    drunk = require('../math/drunk'),
    toNumber = require('../util/toNumber');

/**
 * Timer function where the tick interval performs a [drunk walk](https://en.wikipedia.org/wiki/Random_walk) between `min...max` milliseconds. Very similar to `dust`, except that the interval time is decided by an internal `drunk`.
 * @static
 * @memberof plonk
 * @name walk
 * @param {number} min
 * @param {number} max
 * @param {function} [callback=noop]
 * @returns {promise}
 * @example
 * plonk.walk(30, 100, function (interval, i, stop) {
 *   if (i === 10) stop();
 * })
 * .progress(function (interval) {
 *   console.log(interval);
 *   // => 33.142554000000004
 *   //    32.238087
 *   //    35.621671000000006
 *   //    40.125057
 *   //    41.85763399999999
 *   //    ...
 * })
 * .then(function (elapsed) {
 *   console.log(elapsed);
 *   // => 516.1664309999999
 * });
 */
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
