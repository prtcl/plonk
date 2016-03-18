
var defer = require('../util/defer'),
    rand = require('../math/rand');

// timer function where the interval jitters between min and max milliseconds

module.exports = function (min, max, callback) {
  min || (min = 0);
  if (arguments.length === 2) {
    max = min;
    min = 0;
  }
  var def = defer(), cont = true, i = 0, progress;
  (function dust () {
    var time = Math.round(rand(min, max));
    setTimeout(function(){
      callback && (progress = callback(time, i++, stop));
      def.notify(progress);
      if (cont === true) dust();
    }, time);
  })();
  function stop (val) {
    cont = false;
    def.resolve(val);
  }
  return def.promise;
};
