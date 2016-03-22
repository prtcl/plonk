
/**
 * Passes `value` unaltered if it is a Number, converts to Number if it's a coercible String, or returns `default` if null, undefined, or NaN.
 * @static
 * @memberof plonk
 * @name toNumber
 * @param {number} value
 * @param {number} [default=0]
 * @returns {number} `value`
 * @example
 * plonk.toNumber(1);
 * // => 1
 * plonk.toNumber('2');
 * // => 2
 * var n;
 * plonk.toNumber(n, 10);
 * // => 10
 */
module.exports = function (n, def) {
  def || (def = 0);
  if (n === null || typeof n === 'undefined') {
    return def;
  }
  if (typeof n === 'string') {
    n = +n;
  }
  if (isNaN(n)) return def;
  return n;
};
