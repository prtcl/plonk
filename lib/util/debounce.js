
var toNumber = require('./toNumber');

/**
 * The classic debounce factory. Returns a wrapper around `callback` that will only be executed once, `time` milliseconds after the last call.
 * @static
 * @memberof plonk
 * @name debounce
 * @param {number} [time=100]
 * @param {function} callback
 * @returns {function} debounced `callback`.
 * @example
 * var n = 0;
 * var debounced = plonk.debounce(100, function () { n++; });
 * for (var i = 0; i < 10; i++) {
 *   setTimeout(debounced, 0);
 * }
 * setTimeout(function () {
 *   console.log(n);
 *   // => 1
 * }, 200);
 */
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
