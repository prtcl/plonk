
var defer = require('../util/defer'),
    now = require('../util/now'),
    toNumber = require('../util/toNumber');

/**
 * A variable timer loop where the tick interval is decided by the return value of `callback`. If none is provided, the previous/intial value is used. `time` sets the intial interval value.
 *
 * The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), and a `stop()` function.
 * @static
 * @memberof plonk
 * @name delay
 * @param {number} time
 * @param {function} callback
 * @returns {promise} 
 * @example
 * var t = 100;
 * plonk.delay(t, function (interval, i, stop) {
 *   if (i == 10) return stop();
 *   return t = t * 1.15;
 * })
 * .progress(function (interval) {
 *   console.log(interval);
 *   // => 101.240485
 *   //    116.455409
 *   //    133.112382
 *   //    153.69553200000001
 *   //    174.27022699999998
 *   //    ...
 * })
 * .then(function (elapsed) {
 *   console.log(elapased);
 *   // => 351.988523
 * });
 */
module.exports = function (time, callback) {
  time = toNumber(time, 10);
  var def = defer(), prev = now(), cont = true, i = 0, elapsed = 0, interval, progress;
  (function next () {
    setTimeout(function() {
      interval = now() - prev;
      elapsed += interval;
      prev = now();
      callback && (progress = callback(interval, i++, stop));
      time = toNumber(progress, time);
      def.notify(interval);
      if (cont === true) next();
    }, time);
  })();
  function stop () {
    cont = false;
    def.resolve(elapsed);
  }
  return def.promise;
};
