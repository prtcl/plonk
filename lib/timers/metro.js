
var defer = require('../util/defer');

// wrapper for setInterval with stop function
// returns a promise that is resolved when the timer stops
// the promise is notified on every tick with the tick function's return value

module.exports = function (time, callback) {
  time = Math.round(time || 0);
  var def = defer(), i = 0, progress;
  var timer = setInterval(function () {
    callback && (progress = callback(i++, stop));
    def.notify(progress);
  }, time);
  function stop (val) {
    clearTimeout(timer);
    def.resolve(val);
  }
  return def.promise;
};
