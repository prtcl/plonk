
var defer = require('../util/defer'),
    drunk = require('../math/drunk');

// timer function where the interval is decided by a "drunk walk" between min and max milliseconds

module.exports = function (min, max, callback) {
  min || (min = 0);
  if (arguments.length === 2) {
    max = min;
    min = 0;
  }
  var def = defer(), d = drunk(min, max), cont = true, i = 0, progress;
  (function walk () {
    var time = Math.round(d());
    setTimeout(function(){
      callback && (progress = callback(time, i++, stop));
      def.notify(progress);
      if (cont === true) walk();
    }, time);
  })();
  function stop (val) {
    cont = false;
    def.resolve(val);
  }
  return def.promise;
};
