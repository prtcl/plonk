
import Deferred from './Deferred';
import Timer from './Timer';
import tryFn from './_tryFn';

// A repeating timer loop (like setInterval) where `time` is the tick interval in milliseconds.

export default function metro (time, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('metro callback needs to be a function');
  }

  const def = new Deferred();

  const timer = new Timer(time, () => {
    const [err, res] = tryFn(
      callback,
      timer.interval,
      timer.iterations,
      timer.elapsed,
      stop
      );

    if (err) {
      timer.stop();
      return def.reject(err);
    }

    def.notify(res);
  });

  timer.run();

  function stop (val) {
    def.resolve(val);
    timer.stop();
  }

  return def.promise;
}
