
import noop from './_noop';

let animationFrame;

if (typeof window === 'object') {
  let availableFrames = [
    window.requestAnimationFrame,
    window.webkitRequestAnimationFrame,
    window.mozRequestAnimationFrame,
    window.msRequestAnimationFrame,
    window.oRequestAnimationFrame
  ];

  for (var i = 0; i < availableFrames.length; i++) {
    if (animationFrame) {
      break;
    } else if (typeof availableFrames[i] === 'function') {
      animationFrame = availableFrames[i].bind(window);
    }
  }
}

if (!animationFrame) {
  animationFrame = function (callback = noop) {
    setTimeout(callback, 0);
  };
}

export default animationFrame;
