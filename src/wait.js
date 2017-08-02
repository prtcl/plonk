
import Deferred from './Deferred';
import now from './now';
import toNumber from './toNumber';

// A simple wrapper for setTimeout that returns a promise.

export default function wait (time, callback) {
  time = toNumber(time, 0);

  const def = new Deferred(),
        start = now();

  setTimeout(() => {
    const elapsed = now() - start;

    if (typeof callback === 'function') {
      callback(elapsed);
    }

    def.resolve(elapsed);
  }, time);

  return def.promise;
}
