
import Deferred from './Deferred';
import noop from './_noop';
import now from './now';
import toNumber from './toNumber';

// A simple wrapper for setTimeout that returns a promise.

export default function wait (time, callback = noop) {
  time = toNumber(time, 0);

  const def = new Deferred(),
        start = now();

  setTimeout(() => {
    const elapsed = now() - start;

    callback(elapsed);
    def.resolve(elapsed);
  }, time);

  return def.promise;
}
