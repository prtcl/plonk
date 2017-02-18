
import test from 'tape';

import defer, { Deferred, _Promise } from '../../src/util/defer';
import now from '../../src/util/now';

test('util/defer', (t) => {
  t.equal(typeof defer, 'function', 'defer is a function');
  t.equal(typeof Deferred, 'function', 'Deferred is a function');
  t.equal(typeof _Promise, 'function', '_Promise is a function');

  t.ok(defer() instanceof Deferred, 'defer() returns an instance of Deferred');

  const def = new Deferred();

  t.notOk(def._isResolved, '_isResolved is false');
  t.notOk(def._isRejected, '_isRejected is false');
  t.equal(typeof def._resolveHandler, 'function', '_resolveHandler is a function');
  t.equal(typeof def._rejectHandler, 'function', '_rejectHandler is a function');

  ['resolve', 'reject', 'notify'].forEach((name) => {
    t.equal(typeof def[name], 'function', `${name} is a function`);
  });

  t.ok(def.promise instanceof _Promise, 'promise is an instance of _Promise');
  t.ok(typeof def.promise._progressHandlers === 'object' && def.promise._progressHandlers.length === 0, 'promise._progressHandlers is an array');
  t.equal(typeof def.promise.progress, 'function', 'promise.progress is a function');
  t.deepEqual(def.promise.progress(), def.promise, 'promise.progress() returns promise');

  var n = 0;
  def.promise.progress((val) => {
    t.equal(val, n, `progress: ${val} equals ${n} at ${now()}`);
    if (n > 9) {
      def.resolve(n);
    } else {
      def.notify(++n);
    }
  });

  t.equal(def.promise._progressHandlers.length, 1, 'promise._progressHandlers.length length is 1');

  def.notify(++n);

  const p = def.promise.then((val) => {
    t.equal(val, 10, `then: ${val} equals 10 at ${now()}`);
    t.ok(def._isResolved, 'then: _isResolved is true');
    t.notOk(def._isRejected, 'then: _isRejected is false');

    const d = new Deferred();

    setTimeout(() => {
      d.notify(0);
    }, 50);

    setTimeout(() => {
      d.resolve(1);
    }, 100);

    t.ok(d.promise instanceof _Promise, 'then: promise is an instance of _Promise');

    return d.promise;
  });

  t.equal(typeof p.progress, 'function', 'returned promise.progress is a function');

  p.progress((v) => {
    t.ok(v === 0, 'progress: v equals 0');
  });

  p.then((val) => {
    t.ok(val === 1, 'then: val equals 1');

    t.end();
  });

});
