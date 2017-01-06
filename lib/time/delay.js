
import { Deferred } from '../util/defer';
import noop from '../util/noop';
import Timer from './timer';
import toNumber from '../util/toNumber';

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
export default function delay (time, callback = noop) {
  const def = new Deferred();

  const timer = new Timer(time, () => {
    const progress = callback(timer.interval, timer.index, timer.elapsed, stop);
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
