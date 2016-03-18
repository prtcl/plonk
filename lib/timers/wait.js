
var defer = require('../util/defer'),
    now = require('../util/now');

// simple wrapper for setTimeout that returns a promise
// execution time as reported by performance.now is passed to the resolve callback

module.exports = function (time, callback) {
  time = Math.round(time || 0);
  var def = defer(), start = now();
  setTimeout(function () {
    var end = now() - start;
    callback && callback(end);
    def.resolve(end);
  }, time);
  return def.promise;
};
