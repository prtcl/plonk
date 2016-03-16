
var scale = require('../math/scale');

// interpolate between value and target over time

module.exports = function (value, target, time, callback) {
  var steps = Math.round(time / 10), i = 0, timer;
  if (time > 10) {
    timer = setInterval(function(){
      i++;
      callback && callback(scale(i, 1, steps, value, target), i);
      if (steps === i) clearInterval(timer);
    }, 10);
  } else {
    timer = setTimeout(function(){
      callback && callback(target);
    }, time);
  }
};
