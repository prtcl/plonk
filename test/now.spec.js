
import test from 'tape';

import now from '../src/now';

test('now', (t) => {
  t.equal(typeof now, 'function', 'now is a function');
  t.equal(typeof now(), 'number', `${now()} is a number`);

  let prev = now();

  (function next (i) {
    setTimeout(() => {
      const n = now(),
            diff = n - prev;

      t.ok(n > prev && diff >= 15 && diff <= 36, `${diff} is in 15...36`);

      prev = now();

      if (i < 10) {
        next(++i);
      } else {
        t.end();
      }

    }, 1000 / 60);
  })(0);

});
