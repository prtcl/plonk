
import Deferred from './Deferred';
import noop from './_noop';
import Timer from './_Timer';
import toNumber from './toNumber';

/**
 * A variable timer loop where the tick interval is decided by the return value of `callback`. If none is provided, the previous/intial value is used. `time` sets the intial interval value.
 *
 * The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), `elapsed` (total run time), and a `stop()` function.
 * @static
 * @memberof plonk
 * @name delay
 * @param {number} time
 * @param {function} callback
 * @returns {promise}
 * @example
 * var t = 100;
 * plonk.delay(t, function (interval, i, elapsed, stop) {
 *   if (i == 10) {
 *     return stop();
 *   }
 *   return (t = t * 1.15);
 * })
 * .progress(function (interval) {
 *   console.log(interval);
 *   // => 10
 *   //  115.000208
 *   //  132.25017300000002
 *   //  152.087796
 *   //  174.90065899999996
 *   //    ...
 * })
 * .then(function (elapased) {
 *   console.log(elapased);
 *   // => 2334.929456
 * });
 */
export default function delay (time, callback = noop) {
  const def = new Deferred();

  const timer = new Timer(time, () => {
    const progress = callback(timer.interval, timer.iterations, timer.elapsed, stop);
    timer.time = time = toNumber(progress, time);

    def.notify(timer.interval);
  });
  timer.run();

  function stop () {
    def.resolve(timer.elapsed);
    timer.stop();
  }

  return def.promise;
}
