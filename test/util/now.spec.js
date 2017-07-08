
import test from 'tape';

import now from '../../src/util/now';

test('util/now', (t) => {
  t.equal(typeof now, 'function', 'now is a function');
  t.equal(typeof now(), 'number', `${now()} is a number`);

  let prev = now();

  (function next (i) {
    setTimeout(() => {
      const n = now();

      t.ok(n > prev && (n - prev) > 16, `${n} is greater than ${n - prev} + 16`);

      prev = now();

      if (i < 10) {
        next(++i);
      } else {
        t.end();
      }

    }, 1000 / 60);
  })(0);

});
