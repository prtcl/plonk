
var defer = require('../util/defer'),
    now = require('../util/now');

// animation loop and requestAnimationFrame polyfill with stop function

var frameHandler = (function () {
  var frame;
  if (typeof window === 'object') {
    var availableFrames = [
      window.requestAnimationFrame,
      window.mozRequestAnimationFrame,
      window.webkitRequestAnimationFrame,
      window.msRequestAnimationFrame,
      window.oRequestAnimationFrame
    ];
    for (var i = 0; i < availableFrames.length; i++) {
      frame || (frame = (availableFrames[i] ? availableFrames[i] : null));
    }
  }
  if (!frame) frame = function (callback) { setTimeout(callback, 1000 / 16); };
  return frame;
})();

module.exports = function (callback) {
  var def = defer();
  if (!callback || typeof callback !== 'function') {
    var err = new Error('plonk.frames requires a callback as argument');
    throw err;
  }
  var start = now(), cont = true, progress, i = 0;
  frameHandler(function next () {
    var time = now();
    callback && (progress = callback(time, start, i++, stop));
    def.notify(progress);
    if (cont === true) frameHandler(next);
  });
  function stop (val) {
    cont = false;
    def.resolve(val);
  }
  return def.promise;
};
