
import { Deferred } from '../util/defer';
import noop from '../util/noop';
import Timer from './timer';

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
export default function metro (time, callback = noop) {
  const def = new Deferred();

  const timer = new Timer(time, () => {
    var progress = callback(timer.interval, timer.index, stop);
    def.notify(progress);
  });
  timer.run();

  function stop (val) {
    def.resolve(val);
    timer.stop();
  }

  return def.promise;
}
