
var defer = require('../util/defer'),
    now = require('../util/now');

// wrapper for setInterval with stop function
// returns a promise that is resolved when the timer stops
// the tick interval time as reported by performance.now() is passed into the tick callback
// the promise is notified on every tick with the tick function's return value

module.exports = function (time, callback) {
  time = Math.round(time || 0);
  var def = defer(), i = 0, prev = now(), interval, progress;
  var timer = setInterval(function () {
      interval = now() - prev;
      prev = now();
    callback && (progress = callback(interval, i++, stop));
    def.notify(progress);
  }, time);
  function stop (val) {
    clearTimeout(timer);
    def.resolve(val);
  }
  return def.promise;
};
