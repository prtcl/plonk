
var scale = require('../math/scale'),
    constrain = require('../math/constrain'),
    metro = require('./metro'),
    toNumber = require('../util/toNumber');

var period = (Math.PI * 2) - 0.0001;

/**
 * A sine LFO where `period` is the time in milliseconds of one full cycle. The current `value` of the sine is passed to both `callback` and `.progress()`, and is in the `-1...1` range.
 *
 * In addition to the sine `value`, the `callback` function is passed `cycle` (time elapsed in the current cycle), `elapsed` (total running time), and a `stop()` function. The return value of `callback` will set a new cycle duration.
 * @static
 * @memberof plonk
 * @name sine
 * @param {number} period
 * @param {function} callback
 * @returns {promise}
 * @example
 * plonk.sine(300, function (value, cycle, elapsed, stop) {
 *   if (elapsed >= 10000) return stop('some return value');
 *   if (cycle === 0) {
 *     // set a new duration at the begining of every cycle
 *     return plonk.rand(250, 350);
 *   }
 * })
 * .progress(function (value) {
 *   console.log(value);
 *   // => 0
 *   //    0.12071966755713318
 *   //    0.48600214034421146
 *   //    0.5692098047602766
 *   //    0.635380313957961
 *   //    ...
 * })
 * .then(function (val) {
 *   console.log(val);
 *   // => 'some return value'
 * });
 */
module.exports = function (time, callback) {
  time = toNumber(time, 0);
  var cycle = 0, elapsed = 0, progress;
  return metro(4, function (interval, i, stop) {
    var rad = scale(cycle, 0, time, 0, period);
    if (cycle >= time) {
      cycle = 0;
    } else {
      cycle += interval;
    }
    elapsed += interval;
    var sin = constrain(Math.sin(rad), -1, 1);
    callback && (progress = callback(sin, cycle, elapsed, stop));
    time = toNumber(progress, time);
    return sin;
  });
};
