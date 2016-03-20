
var scale = require('../math/scale'),
    constrain = require('../math/constrain'),
    metro = require('../timers/metro');

// a sine wave LFO with cycle time passed as ms

var period = (Math.PI * 2) - 0.0001;

module.exports = function (time, callback) {
  time = Math.round(time || 0);
  var cycle = 0, total = 0, progress = time;
  return metro(4, function (interval, i, stop) {
    var rad = scale(cycle, 0, time, 0, period);
    if (cycle >= time) {
      cycle = 0;
    } else {
      cycle += interval;
    }
    total += cycle;
    var sin = constrain(Math.sin(rad), -1, 1);
    callback && (progress = callback(sin, cycle, total, stop));
    if (progress) time = Math.round(progress);
    return sin;
  });
};
