
import test from 'tape';

import env from '../src/env';
import now from '../src/now';
import Promise from '../src/_Promise';

test('env', (t) => {
  t.equal(typeof env, 'function', 'env is a function');

  var prev = now(),
      iterations = 0;

  const p = env(-1, 1, 100, (val, elapsed, stop) => {
    if (iterations === 0) {
      t.equal(typeof val, 'number', 'value is a number');
      t.equal(typeof elapsed, 'number', 'elapsed is a number');
      t.equal(typeof stop, 'function', 'stop is a function');
    }
  });

  t.ok(p instanceof Promise, 'env() returns a promise');

  p
    .progress((val) => {
      var interval = (iterations === 0 ? 16 : now() - prev);
      prev = now();
      iterations++;

      t.ok(interval >= 15 && interval <= 30, `progress: ${interval} is in 16...26`);
      t.ok(val >= -1 && val <= 1, `progress: ${val} is in -1...1`);

    })
    .then((val) => {
      t.ok(val === 1, `then: ${val} equals 1`);

      t.end();
    });

});
