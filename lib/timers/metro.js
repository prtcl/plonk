
var defer = require('../util/defer'),
    now = require('../util/now'),
    toNumber = require('../util/toNumber');

/**
 * setInterval wrapper where `time` is the tick interval in milliseconds.
 *
 * The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), and a `stop()` function. The `callback` return value is passed to the `.progress()` handler, making it trivial to use `metro` to compose time-based interpolations and modulators.
 *
 * When `stop(value)` is called, the returned promise is resolved with `value`.
 * @static
 * @memberof plonk
 * @name metro
 * @param {number} time
 * @param {function} [callback=noop]
 * @returns {promise} 
 * @example
 * var n = 0;
 * plonk.metro(4, function (interval, i, stop) {
 *   console.log(interval);
 *   // => 4.246183000000002
 *   n += Math.random();
 *   if (i === 10) return stop(n);
 *   return n;
 * })
 * .progress(function (n) {
 *   console.log(n);
 *   // => 0.8043495751917362
 *   //    1.0118556288070977
 *   //    1.535184230422601
 *   //    1.9694649016018957
 *   //    2.188968440517783
 *   //    ...
 * })
 * .then(function (n) {
 *   console.log(n);
 *   // => 5.08520966116339
 * });
 */
module.exports = function (time, callback) {
  time = toNumber(time, 4);
  var def = defer(), i = 0, prev = now(), interval, progress;
  var timer = setInterval(function () {
    interval = now() - prev;
    prev = now();
    callback && (progress = callback(interval, i++, stop));
    def.notify(progress);
  }, time);
  function stop (val) {
    clearTimeout(timer);
    def.resolve(val);
  }
  return def.promise;
};
