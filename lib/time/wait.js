
import { Deferred } from '../util/defer';
import noop from '../util/noop';
import toNumber from '../util/toNumber';
import Timer from './timer';

/**
 * Simple wrapper for setTimeout that returns a promise.
 * @static
 * @memberof plonk
 * @name wait
 * @param {number} time
 * @param {function} [callback=noop]
 * @returns {promise}
 * @example
 * plonk.wait(100)
 *   .then(function (elapsed) {
 *     console.log(elapsed);
 *     // => 102.221583
 *   });
 */
export default function wait (time, callback = noop) {
  const def = new Deferred();

  const timer = new Timer(toNumber(time, 0), (interval, i, elapsed) => {
    if (elapsed < time) return;

    callback(interval);
    def.resolve(interval);

    timer.stop();
  });
  timer.run();

  return def.promise;
}
