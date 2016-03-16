
var drunk = require('../math/drunk');

// timer function that performs a "drunk walk" between min and max milliseconds

module.exports = function (min, max, callback) {
  var d = drunk(min, max), walk = {}, i = 0, isPlaying = true;
  (function walk () {
    var time = Math.round(d());
    setTimeout(function(){
      if (!isPlaying) return;
      var cont;
      callback && (cont = callback(time, i++));
      if (cont !== false) walk();
    }, time);
  })();
  walk.stop = function () { isPlaying = false; };
  return walk;
};
