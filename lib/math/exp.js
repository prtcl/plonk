
var constrain = require('./constrain'),
    toNumber = require('../util/toNumber');

/**
 * An exponential map of `value` in `0...1` range by [Euler's number](https://en.wikipedia.org/wiki/E_(mathematical_constant)). This makes a nice natural curve, suitable for making smooth transitions for things like audio gain, distance, and decay values.
 * @static
 * @memberof plonk
 * @name exp
 * @param {number} value
 * @returns {number} `value` remmaped to exponential curve
 * @example
 * [0, 0.25, 0.5, 0.75, 1].forEach(function (n) {
 *   plonk.exp(n);
 *   // => 0
 *   //    0.023090389875362178
 *   //    0.15195522325791297
 *   //    0.45748968090533415
 *   //    1
 * });
 */
module.exports = function (n) {
  n = toNumber(n, 0);
  return Math.pow(constrain(n, 0, 1), Math.E);
};
