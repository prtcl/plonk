
var Promise = require('native-or-lie');

// simple wrapper for setTimeout that returns a promise

module.exports = function (time, callback) {
  time = Math.round(time || 0);
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      callback && callback(time);
      resolve(time);
    }, time);
  });
};
