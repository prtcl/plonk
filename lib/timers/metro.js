
// simple wrapper for setInterval with stop function

module.exports = function (time, callback) {
  var metro = {}, i = 0, timer;
  timer = setInterval(function () {
    var cont
    callback && (cont = callback(i++));
    if (cont === false) metro.stop();
  }, Math.round(time));
  metro.stop = function () { clearTimeout(timer); };
  return metro;
};
