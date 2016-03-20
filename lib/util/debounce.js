
var toNumber = require('./toNumber');

// returns a function that will only be executed once, N milliseconds after the last call

module.exports = function (time, callback) {
  if (arguments.length === 2) {
    time = toNumber(time, 100);
  } else if (arguments.length === 1) {
    callback = time;
    time = 100;
  }
  var timer;
  return function () {
    timer && clearTimeout(timer);
    timer = setTimeout(callback, time);
  };
};
