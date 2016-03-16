
var rand = require('../math/rand');

// timer function that jitters between min and max milliseconds

module.exports = function (min, max, callback) {
  var dust = {}, i = 0, isPlaying = true;
  (function dust () {
    var time = Math.round(rand(min, max));
    setTimeout(function(){
      if (!isPlaying) return;
      var cont;
      callback && (cont = callback(time, i++));
      if (cont !== false) dust();
    }, time);
  })();
  dust.stop = function () { isPlaying = false; };
  return dust;
};
