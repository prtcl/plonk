
var defer = require('../util/defer'),
    now = require('../util/now'),
    toNumber = require('../util/toNumber');

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
module.exports = function (time, callback) {
  time = toNumber(time, 0);
  var def = defer(), start = now();
  setTimeout(function () {
    var end = now() - start;
    callback && callback(end);
    def.resolve(end);
  }, time);
  return def.promise;
};
