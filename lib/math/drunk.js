
var constrain = require('./constrain'),
    rand = require('./rand'),
    toNumber = require('../util/toNumber');

/**
 * Factory that returns a [drunk walk](https://en.wikipedia.org/wiki/Random_walk) random function that walks between `min...max`.
 * @static
 * @memberof plonk
 * @name drunk
 * @param {number} [min=max]
 * @param {number} [max=1]
 * @param {number} [step=0.1]
 * @returns {function} for drunk walking.
 * @example
 * var drunk = plonk.drunk(-1, 1);
 * for (var i = 0; i < 100; i++) {
 *   console.log(drunk());
 *   // => 0.9912726839073003
 *   //    0.9402238005306572
 *   //    0.8469231501687319
 *   //    0.9363016556948425
 *   //    0.9024078783579172
 *   //    ...
 * }
 */
module.exports = function (min, max, step) {
  min = toNumber(min, 0);
  max = toNumber(max, 1);
  step = constrain(toNumber(step, 0.1), 0, 1);
  if (arguments.length <= 1) {
    max = min || 1;
    min = 0;
  }
  var n = rand(min, max);
  return function (s) {
    step = toNumber(s, step);
    n = constrain(n + (max * rand(-1, 1) * step), min, max);
    return n;
  };
};
