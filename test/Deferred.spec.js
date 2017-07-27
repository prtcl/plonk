
import test from 'tape';

import Deferred from '../src/Deferred';
import Promise from '../src/_Promise';

test('Deferred', (t) => {
  t.equal(typeof Deferred, 'function', 'Deferred is a function');

  const def = new Deferred();

  t.ok(def.promise instanceof Promise, 'deferred.promise is an instance of Promise');

  ['resolve', 'reject', 'notify'].forEach((name) => {
    t.equal(typeof def[name], 'function', `deferred.${name} is a function`);
  });

  t.end();
});
