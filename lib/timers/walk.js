
var variable = require('./variable'),
    drunk = require('../math/drunk');

// timer function where the interval is decided by a "drunk walk" between min and max milliseconds

module.exports = function (min, max, callback) {
  min || (min = 0);
  if (arguments.length === 2) {
    max = min;
    min = 0;
  }
  var d = drunk(min, max);
  return variable(d(), function (time, i, stop) {
    callback && callback(time, i, stop);
    return d();
  });
};
