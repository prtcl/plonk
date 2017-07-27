
import Deferred from './_Deferred';
import noop from './_noop';
import Timer from './_Timer';

/**
 * A repeating timer loop (like setInterval) where `time` is the tick interval in milliseconds.
 *
 * The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), `elapsed` (total run time), and a `stop()` function.
 *
 * Also, the `callback` return value is passed to the `.progress()` handler, making it trivial to use `metro` to compose time-based interpolations and modulators.
 *
 * When `stop(value)` is called, the returned promise is resolved with `value`.
 * @static
 * @memberof plonk
 * @name metro
 * @param {number} time
 * @param {function} [callback=noop]
 * @returns {promise}
 * @example
 * plonk.metro(100, function (interval, i, elapsed, stop) {
 *   console.log(interval);
 *   // => 100.00048099999992
 *   var n = Math.random();
 *   if (i === 10) {
 *     return stop(n);
 *   }
 *   return n;
 * })
 * .progress(function (n) {
 *   console.log(n);
 *   // => 0.6465891992386279
 *   //    0.4153539338224437
 *   //    0.17397237631722784
 *   //    0.6499483881555588
 *   //    0.664554645336491
 *   // ...
 * })
 * .then(function (n) {
 *   console.log(n);
 *   // => 0.7674513910120222
 * });
 */
export default function metro (time, callback = noop) {
  const def = new Deferred();

  const timer = new Timer(time, () => {
    const progress = callback(timer.interval, timer.iterations, timer.elapsed, stop);
    def.notify(progress);
  });
  timer.run();

  function stop (val) {
    def.resolve(val);
    timer.stop();
  }

  return def.promise;
}
