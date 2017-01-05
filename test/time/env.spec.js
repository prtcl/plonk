
import Promise from 'promise/lib/es6-extensions';
import test from 'tape';

import env from '../../lib/time/env';
import now from '../../lib/util/now';

test('time/env', (t) => {
  t.equal(typeof env, 'function', 'env is a function');

  var prev = now();

  const p = env(-1, 1, 100);

  t.ok(p instanceof Promise, 'env() returns a promise');

  p
    .progress((val) => {
      var interval = now() - prev;
      prev = now();

      t.ok(interval >= 16 && interval <= 26, `tick: ${interval} is in 16...26`);
      t.ok(val >= -1 && val <= 1, `tick: ${val} is in -1...1`);

    })
    .then((val) => {
      t.ok(val === 1, `then: ${val} equals 1`);

      t.end();
    });

});
