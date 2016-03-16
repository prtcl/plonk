
var Promise = require('native-or-lie');

// wrapper for setInterval with stop function
// returns a promise that is resolved when the timer stops

module.exports = function (time, callback) {
  time = Math.round(time || 0);
  var i = 0, cont;
  return new Promise(function (resolve, reject) {
    var timer = setInterval(function () {
      callback && (cont = callback(i++, stop));
      if (cont === false) stop();
    }, time);
    function stop (arg) {
      clearTimeout(timer);
      resolve(arg);
    }
  });
};
