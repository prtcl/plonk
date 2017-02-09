
import asap from 'asap';

import { Deferred } from '../util/defer';
import clamp from '../math/clamp';
import noop from '../util/noop';
import Timer from './timer';
import toNumber from '../util/toNumber';

/**
 * Animation loop and [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) polyfill with a little extra sugar.
 *
 * If `frameRate` is passed, the loop iteration time is throttled to `1000 / frameRate`. Also differs from the native API in that the `callback` function receives `interval` (time since the previous frame), `elapsed` (total running time), `i` (number of frames), and a `stop()` function. When `stop()` is called, the returned promise is resolved with the `elapsed` value.
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
export default function frames (frameRate, callback = noop) {

  if (arguments.length === 2) {
    frameRate = clamp(toNumber(frameRate, 60), 1, 60);
  } else if (arguments.length === 1) {
    callback = frameRate || callback;
    frameRate = 60;
  }

  const def = new Deferred();

  const timer = new Frames(1000 / frameRate, () => {
    const progress = callback(timer.interval, timer.iterations, timer.elapsed, stop);

    if (typeof progress === 'number') {
      frameRate = clamp(toNumber(progress, frameRate), 0, 60);
      if (frameRate === 0) {
        stop();
      } else {
        timer.time = 1000 / frameRate;
      }
    }

    def.notify(timer.interval);
  });
  timer.run();

  function stop () {
    def.resolve(timer.elapsed);
    timer.stop();
  }

  return def.promise;
}

export class Frames extends Timer {

  constructor (time, callback = noop) {
    super(time, callback);
    this._tickHandler = frameHandler;
    this._timeOffset = -5;
  }

}

export const frameHandler = (function () {

  var frame;

  if (typeof window === 'object') {
    let availableFrames = [
      window.requestAnimationFrame,
      window.webkitRequestAnimationFrame,
      window.mozRequestAnimationFrame
    ];

    for (var i = 0; i < availableFrames.length; i++) {
      if (typeof availableFrames[i] === 'function') {
        frame = availableFrames[i].bind(window);
        break;
      }
    }

  }

  if (!frame) {
    frame = asap;
  }

  return frame;

})();
