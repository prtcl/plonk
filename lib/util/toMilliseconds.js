
var toNumber = require('./toNumber');

var formats = ['hz', 'ms', 's', 'm'];

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
