
var defer = require('../util/defer'),
    now = require('../util/now'),
    tick = require('../util/tick'),
    toNumber = require('../util/toNumber');

// animation loop and requestAnimationFrame polyfill with stop function

var frameHandler = (function () {
  var frame;
  if (typeof window === 'object') {
    var availableFrames = [
      window.requestAnimationFrame,
      window.webkitRequestAnimationFrame,
      window.mozRequestAnimationFrame,
      window.msRequestAnimationFrame,
      window.oRequestAnimationFrame
    ];
    for (var i = 0; i < availableFrames.length; i++) {
      frame || (frame = (availableFrames[i] ? availableFrames[i] : null));
      if (frame) break;
    }
  }
  if (!frame) frame = function (callback) { setTimeout(callback, 1000 / 60); };
  return frame;
})();

module.exports = function (frameRate, callback) {
  if (arguments.length === 2) {
    frameRate = toNumber(frameRate, 60);
  } else if (arguments.length === 1) {
    callback = frameRate;
    frameRate = 60;
  }
  if (!callback || typeof callback !== 'function') {
    throw new Error('plonk.frames requires a callback as argument');
  }
  var def = defer(), prev = now(), elapsed = 0, i = 0, cont = true, interval, progress;
  frameHandler(function next () {
    interval = now() - prev;
    if (elapsed && interval <= ((1000 / frameRate) - 5)) {
      return tick(frameHandler(next));
    }
    prev = now();
    elapsed += interval;
    callback && (progress = callback(interval, elapsed, i++, stop));
    frameRate = toNumber(progress, frameRate);
    if (frameRate === 0) stop();
    def.notify(interval);
    if (cont === true) frameHandler(next);
  });
  function stop () {
    cont = false;
    def.resolve(elapsed);
  }
  return def.promise;
};
