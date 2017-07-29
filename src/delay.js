
import Deferred from './Deferred';
import noop from './_noop';
import Timer from './Timer';
import toNumber from './toNumber';

// A timer loop, similar to setInterval, except that the time can be reset by the return value of `callback`

export default function delay (time, callback = noop) {
  const def = new Deferred();

  const timer = new Timer(time, () => {
    const progress = callback(timer.interval, timer.iterations, timer.elapsed, stop);
    timer.time = time = toNumber(progress, time);

    def.notify(timer.interval);
  });
  timer.run();

  function stop () {
    def.resolve(timer.elapsed);
    timer.stop();
  }

  return def.promise;
}
