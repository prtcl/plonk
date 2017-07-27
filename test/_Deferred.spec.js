
import test from 'tape';

import defer from '../src/defer';
import Deferred from '../src/_Deferred';
import Promise from '../src/_Promise';

test('Deferred', (t) => {
  t.equal(typeof defer, 'function', 'defer is a function');
  t.equal(typeof Deferred, 'function', 'Deferred is a function');

  t.ok(defer() instanceof Deferred, 'defer() returns an instance of Deferred');

  const def = new Deferred();

  ['resolve', 'reject', 'notify'].forEach((name) => {
    t.equal(typeof def[name], 'function', `deferred.${name} is a function`);
  });

  t.ok(def.promise instanceof Promise, 'deferred.promise is an instance of Promise');

  t.end();
});
