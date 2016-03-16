
var constrain = require('./constrain');

// linear map of input value from input range to output range

module.exports = function (n, a1, a2, b1, b2) {
  return b1 + (constrain(n, a1, a2) - a1) * (b2 - b1) / (a2 - a1);
};
