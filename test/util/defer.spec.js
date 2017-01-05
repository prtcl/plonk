
import Promise from 'promise/lib/es6-extensions';
import test from 'tape';

import defer, { Deferred } from '../../lib/util/defer';
import now from '../../lib/util/now';

test('util/defer', (t) => {
  t.equal(typeof defer, 'function', 'defer is a function');
  t.equal(typeof Deferred, 'function', 'Deferred is a function');

  t.ok(defer() instanceof Deferred, 'defer() returns an instance of Deferred');

  const def = new Deferred();

  t.notOk(def.isResolved, 'isResolved is false');
  t.notOk(def.isRejected, 'isRejected is false');
  t.equal(typeof def.resolveHandler, 'function', 'resolveHandler is a function');
  t.equal(typeof def.rejectHandler, 'function', 'rejectHandler is a function');
  t.ok(typeof def.progressHandlers === 'object' && def.progressHandlers.length === 0, 'progressHandlers is an array');

  t.ok(def.promise instanceof Promise, 'promise is an instance of Promise');
  t.equal(typeof def.promise.progress, 'function', 'promise.progress is a function');
  t.deepEqual(def.promise.progress(), def.promise, 'promise.progress() returns def.promise');

  ['resolve', 'reject', 'notify'].forEach((name) => {
    t.equal(typeof def[name], 'function', `${name} is a function`);
  });

  var n = 0;
  def.promise.progress((val) => {
    t.equal(val, n, `progress: ${val} equals ${n} at ${now()}`);
    if (n > 9) {
      def.resolve(n);
    } else {
      def.notify(++n);
    }
  });

  t.equal(def.progressHandlers.length, 1, 'progressHandlers.length length is 1');

  def.notify(++n);

  def.promise.then((val) => {
    t.equal(val, 10, `then: ${val} equals 10 at ${now()}`);
    t.ok(def.isResolved, 'isResolved is true');
    t.notOk(def.isRejected, 'isRejected is false');

    t.end();
  });

});
