
var defer = require('../util/defer'),
    now = require('../util/now'),
    toNumber = require('../util/toNumber');

// simple wrapper for setTimeout that returns a promise
// execution time as reported by performance.now is passed to the resolve callback

module.exports = function (time, callback) {
  time = toNumber(time, 0);
  var def = defer(), start = now();
  setTimeout(function () {
    var end = now() - start;
    callback && callback(end);
    def.resolve(end);
  }, time);
  return def.promise;
};
