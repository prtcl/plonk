
// returns a function that will only be executed N milliseconds after the last call

module.exports = function (time, callback) {
  var timer;
  return function () {
    timer && clearTimeout(timer);
    timer = setTimeout(callback, Math.round(time));
  };
};
