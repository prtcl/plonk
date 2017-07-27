
import Deferred from './_Deferred';
import noop from './_noop';
import now from './now';
import toNumber from './_toNumber';

/**
 * A simple wrapper for setTimeout that returns a promise.
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
  time = toNumber(time, 0);

  const def = new Deferred(),
        start = now();

  setTimeout(() => {
    const elapsed = now() - start;

    callback(elapsed);
    def.resolve(elapsed);
  }, time);

  return def.promise;
}
