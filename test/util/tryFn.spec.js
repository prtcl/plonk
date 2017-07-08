
import test from 'tape';

import tryFn from '../../src/util/tryFn';

test('util/tryFn', (t) => {
  t.equal(typeof tryFn, 'function', 'tryFn is a function');

  try {
    tryFn();
  } catch (e) {
    t.ok(e && e instanceof TypeError, 'throws TypeError if no callback is passed');
  }

  let [res, err] = tryFn((val) => {
    return val;
  }, 1);

  t.equal(res, 1, 'res equals 1');
  t.notOk(err, 'no error returned for passing function');

  [res, err] = tryFn(() => {
    throw new TypeError('bonk');
  });

  t.notOk(res, 'no result returned for failing function');
  t.ok(err && err instanceof TypeError, 'err is an instanceof TypeError');

  function errFn () {
    throw new Error('bonk');
  }

  [res, err] = tryFn(() => {
    errFn();
  });

  t.equal(err.message, 'bonk', 'errors bubble up from called functions');

  t.end();
});
