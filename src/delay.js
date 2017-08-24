
import Deferred from './Deferred';
import Timer from './Timer';
import tryFn from './_tryFn';

// A timer loop, similar to setInterval, except that the time can be reset by the return value of `callback`

export default function delay (time, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('delay callback needs to be a function');
  }

  const def = new Deferred();

  const timer = new Timer(time, (interval, iterations, elapsed) => {
    const [err, res] = tryFn(
      callback,
      interval,
      iterations,
      elapsed,
      stop
      );

    if (err) {
      timer.stop();
      return def.reject(err);
    }

    timer.setTime(res);
    def.notify(interval);
  });

  timer.run();

  function stop () {
    const elapsed = timer.stop();
    def.resolve(elapsed);
  }

  return def.promise;
}
