
import toNumber from './toNumber';

export const FORMAT_IDENTIFIERS = ['fps', 'hz', 'ms', 's', 'm'];

// Number format converter that takes a variety of input time values and returns the equivalent millisecond values.

export default function toMilliseconds (val, format = 'ms', def = 0) {
  let ms = toNumber(def, 0);

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
    case 'fps':
      ms = 1000 / val;
      break;
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
