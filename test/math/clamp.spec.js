
import test from 'tape';

import clamp from '../../lib/math/clamp';
import rand from '../../lib/math/rand';

test('math/clamp', (t) => {
  t.equals(typeof clamp, 'function', 'clamp is a function');

  const arr = new Array(10).fill()
    .map(() => rand(-1.2, 1.2));

  arr.forEach((n) => {
    n = clamp(n, -1, 1);

    t.ok(n >= -1 && n <= 1, `${n} is in -1...1`);
  });

  t.end();
});
