
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
  var def = new Deferred();

  var timer = new Timer(toNumber(time, 0), (elapsed) => {
    callback(elapsed);
    def.resolve(elapsed);

    timer.stop();
  });
  timer.run();

  return def.promise;
}
