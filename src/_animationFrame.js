
let animationFrame;

if (typeof window === 'object') {
  let availableFrames = [
    window.requestAnimationFrame,
    window.webkitRequestAnimationFrame,
    window.mozRequestAnimationFrame,
    window.msRequestAnimationFrame
  ];

  for (var i = 0; i < availableFrames.length; i++) {
    let frame = availableFrames[i];
    if (typeof frame === 'function') {
      animationFrame = frame.bind(window);
      break;
    }
  }
}

if (!animationFrame) {
  animationFrame = timeoutAnimationFrame;
}

export default animationFrame;

function timeoutAnimationFrame (callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Not enough arguments');
  }
  setTimeout(callback, 0);
}
