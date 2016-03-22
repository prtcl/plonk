
var defer = require('../util/defer'),
    now = require('../util/now'),
    tick = require('../util/tick'),
    toNumber = require('../util/toNumber');

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

/**
 * Animation loop and [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) polyfill with a little extra sugar.
 *
 * If `frameRate` is passed, the loop iteration time is throttled to `1000 / frameRate`. Also differs from the native API in that the `callback` function recieves `interval` (time since the previous frame), `elapsed` (total running time), `i` (number of frames), and a `stop()` function. When `stop()` is called, the returned promise is resolved with the `elapsed` value.
 * @static
 * @memberof plonk
 * @name frames
 * @param {number} [frameRate=60]
 * @param {function} callback
 * @returns {promise} 
 * @example
 * plonk.frames(60, function (interval, elapsed, i, stop) {
 *   console.log(interval);
 *   // => 16.723718000000005
 *   if (someCondition) {
 *     // we can change the target framerate by return value;
 *     return 30;
 *   } else if (i === 10) {
 *     stop();
 *   }
 * })
 * .then(function (elapsed) {
 *   console.log(elapsed);
 *   // => 233.34382600000004
 * });
 */
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
