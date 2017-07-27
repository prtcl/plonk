
import metro from './metro';
import noop from './_noop';
import scale from './scale';
import toNumber from './_toNumber';

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
 *     //    -0.6666658999999999
 *     //    -0.33333203999999994
 *     //    0.0000022800000001321763
 *     //    0.33333864
 *     //    ...
 *   })
 *   .then(function (val) {
 *     console.log(val);
 *     // => 1
 *   });
 */
export default function env (value, target, time, callback = noop) {
  value = toNumber(value, 0);
  target = toNumber(target, 1);
  time = toNumber(time, 100);

  return metro(1000 / 60, (interval, i, elapsed, stop) => {
    if (elapsed >= time) {
      stop(target);
    }

    const interpolated = scale(elapsed, 0, time, value, target);
    callback(interpolated);

    return interpolated;
  });

}
