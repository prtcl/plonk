
var variable = require('./variable'),
    rand = require('../math/rand');

// timer function where the interval jitters between min and max milliseconds

module.exports = function (min, max, callback) {
  min || (min = 0);
  if (arguments.length === 2) {
    max = min;
    min = 0;
  }
  return variable(rand(min, max), function (time, i, stop) {
    callback && callback(time, i, stop);
    return rand(min, max);
  });
};
