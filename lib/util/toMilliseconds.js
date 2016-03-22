
var toNumber = require('./toNumber');

var formats = ['hz', 'ms', 's', 'm'];

/**
 * Also aliased to `plonk.ms`.
 *
 * Number format converter that takes a variety of input time values and returns the equivalent millisecond values. Format options are `ms` (pass input to output), `s` (convert from seconds), `m` (convert from minutes), `hz` (convert from 1 period of hertz). `default` is returned if `value` is null, undefined, or NaN.
 * @static
 * @memberof plonk
 * @name toMilliseconds
 * @param {number} value
 * @param {String} [format=ms]
 * @param {number} [default=0]
 * @returns {number} `value` formatted to milliseconds.
 * @example
 * plonk.ms('2s');
 * // => 2000
 * plonk.ms('30hz');
 * // => 33.333333333333336
 * plonk.ms(Math.random(), 'm');
 * // => 41737.010115757585
 */
module.exports = function (val, format, def) {
  format || (format = 'ms');
  var ms = toNumber(def, 0);
  if (typeof val === 'string') {
    val = val.toLowerCase();
    for (var i = 0; i < formats.length; i++) {
      if (val.indexOf(formats[i]) !== -1) {
        format = formats[i];
        val = val.replace(' ', '').replace(formats[i], '');
        break;
      }
    }
    val = +val;
  }
  if (val === null || typeof val === 'undefined') {
    return ms;
  }
  if (isNaN(val)) return ms;
  if (format === 'hz') {
    ms = (1 / val) * 1000;
  } else if (format === 'ms') {
    ms = val;
  } else if (format === 's') {
    ms = val * 1000;
  } else if (format === 'm') {
    ms = val * 60 * 1000;
  }
  return ms;
};
