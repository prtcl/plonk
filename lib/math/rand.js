
var toNumber = require('../util/toNumber');

/**
 * Random number in `min...max` range.
 * @static
 * @memberof plonk
 * @name rand
 * @param {number} [min=max]
 * @param {number} [max=1]
 * @returns {number} random number
 * @example
 * plonk.rand(-1, 1);
 * // => -0.3230291483923793
 */
module.exports = function (min, max) {
  if (arguments.length <= 1) {
    max = toNumber(min, 1);
    min = 0;
  } else {
    min = toNumber(min, 0);
    max = toNumber(max, 1);
  }
  return Math.random() * (max - min) + min;
};
