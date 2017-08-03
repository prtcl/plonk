
import Deferred from './Deferred';
import Timer from './Timer';
import tryFn from './_tryFn';

// A timer loop, similar to setInterval, except that the time can be reset by the return value of `callback`

export default function delay (time, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('delay callback needs to be a function');
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

    timer.setTime(res);
    def.notify(timer.interval);
  });

  timer.run();

  function stop () {
    def.resolve(timer.elapsed);
    timer.stop();
  }

  return def.promise;
}
