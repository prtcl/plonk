
import delay from './delay';
import noop from '../util/noop';
import rand from '../math/rand';
import toNumber from '../util/toNumber';

/**
 * Timer function where the tick interval jitters between `min...max` milliseconds.
 *
 * The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), `elapsed` (total run time), and a `stop()` function.
 * @static
 * @memberof plonk
 * @name dust
 * @param {number} min
 * @param {number} max
 * @param {function} [callback=noop]
 * @returns {promise}
 * @example
 * plonk.dust(30, 100, function (interval, i, elapsed, stop) {
 *   if (i === 10) {
 *     stop();
 *   }
 * })
 * .progress(function (interval) {
 *   console.log(interval);
 *   // => 74.155273
 *   //    53.998158000000004
 *   //    99.259871
 *   //    53.27543200000002
 *   //    77.56419299999999
 *   //    ...
 * })
 * .then(function (elapsed) {
 *   console.log(elapsed);
 *   // => 663.0071679999999
 * });
 */
export default function dust (min, max, callback = noop) {
  min = toNumber(min, 10);
  max = toNumber(max, 100);

  if (arguments.length <= 2) {
    max = min;
    min = 0;
  }

  return delay(rand(min, max), (interval, i, elapsed, stop) => {
    callback(interval, i, elapsed, stop);
    return rand(min, max);
  });
}
