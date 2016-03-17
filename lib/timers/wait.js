
var defer = require('../util/defer');

// simple wrapper for setTimeout that returns a promise

module.exports = function (time, callback) {
  time = Math.round(time || 0);
  var def = defer();
  setTimeout(function () {
    callback && callback(time);
    def.resolve(time);
  }, time);
  return def.promise;
};
