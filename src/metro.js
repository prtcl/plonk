
import Deferred from './Deferred';
import noop from './_noop';
import Timer from './Timer';

// A repeating timer loop (like setInterval) where `time` is the tick interval in milliseconds.

export default function metro (time, callback = noop) {
  const def = new Deferred();

  const timer = new Timer(time, () => {
    const progress = callback(timer.interval, timer.iterations, timer.elapsed, stop);
    def.notify(progress);
  });
  timer.run();

  function stop (val) {
    def.resolve(val);
    timer.stop();
  }

  return def.promise;
}
