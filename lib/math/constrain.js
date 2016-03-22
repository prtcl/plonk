
var toNumber = require('../util/toNumber');

/**
 * Constrains an input `value` to `min...max` range.
 * @static
 * @memberof plonk
 * @name constrain
 * @param {number} value
 * @param {number} [min=max]
 * @param {number} [max=1]
 * @returns {number} `value` constrained to `min...max` range.
 * @example
 * plonk.constrain(Math.random());
 * // => 0.13917264847745225
 * plonk.constrain(Math.random() * 5 - 2.5, -1, 1);
 * // => 1
 */
module.exports = function (n, min, max) {
  n = toNumber(n, 0);
  min = toNumber(min, 0);
  max = toNumber(max, 1);
  if (arguments.length <= 2) {
    max = min || 1;
    min = 0;
  }
  return Math.min(Math.max(n, min), max);
};
