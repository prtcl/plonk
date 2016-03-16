
// animation loop and requestAnimationFrame polyfill with stop function

var frame = (function () {
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
  var start = plonk.now(), cont = true, i = 0;
  frame(function next () {
    if (cont === false) return;
    var time = plonk.now();
    callback && (cont = callback(time, start, i++));
    frame(next);
  });
};
