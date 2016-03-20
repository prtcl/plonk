
var defer = require('../util/defer'),
    now = require('../util/now'),
    toNumber = require('../util/toNumber');

// timer function where the next interval is decided by the return value of the tick callback
// the tick interval time as reported by performance.now() is passed into the notify callback

module.exports = function (time, callback) {
  time = toNumber(time, 10);
  var def = defer(), prev = now(), cont = true, i = 0, total = 0, interval, progress;
  (function next () {
    setTimeout(function() {
      interval = now() - prev;
      total += interval;
      prev = now();
      callback && (progress = callback(interval, i++, stop));
      time = toNumber(progress, time);
      def.notify(interval);
      if (cont === true) next();
    }, time);
  })();
  function stop () {
    cont = false;
    def.resolve(total);
  }
  return def.promise;
};
