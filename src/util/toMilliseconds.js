
import toNumber from './toNumber';

export const FORMAT_IDENTIFIERS = ['hz', 'ms', 's', 'm'];

/**
 * Number format converter that takes a variety of input time values and returns the equivalent millisecond values.
 *
 * Format options are `ms` (pass input to output), `s` (convert from seconds), `m` (convert from minutes), `hz` (convert from 1 period of hertz).
 *
 * `default` is returned if `value` is null, undefined, or NaN.
 * @static
 * @memberof plonk
 * @name ms
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
export default function toMilliseconds (val, format = 'ms', def = 0) {
  var ms = toNumber(def, 0);
  if (typeof val === 'string') {
    val = val.toLowerCase();
    for (var i = 0; i < FORMAT_IDENTIFIERS.length; i++) {
      if (val.indexOf(FORMAT_IDENTIFIERS[i]) !== -1) {
        format = FORMAT_IDENTIFIERS[i];
        val = val.replace(' ', '').replace(format, '');
        break;
      }
    }
    val = +val;
  }
  if (val === null || typeof val === 'undefined') {
    return ms;
  }
  if (isNaN(val)) return ms;
  switch (format) {
    case 'hz':
      ms = (1 / val) * 1000;
      break;
    case 'ms':
      ms = val;
      break;
    case 's':
      ms = val * 1000;
      break;
    case 'm':
      ms = val * 60 * 1000;
      break;
    default:
  }
  return ms;
}
