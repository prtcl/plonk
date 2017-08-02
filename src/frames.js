
import clamp from './clamp';
import Deferred from './Deferred';
import Frames from './_Frames';
import toNumber from './toNumber';

// Animation loop and requestAnimationFrame polyfill with a little extra sugar

export default function frames (frameRate, callback) {
  if (arguments.length === 2) {
    frameRate = clamp(toNumber(frameRate, 60), 1, 60);
  } else if (arguments.length === 1) {
    callback = frameRate || callback;
    frameRate = 60;
  }

  if (typeof callback !== 'function') {
    throw new TypeError('frames callback needs to be a function');
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
