
import test from 'tape';

import clamp from '../../lib/math/clamp';
import rand from '../../lib/math/rand';

test('math/clamp', (t) => {
  t.equals(typeof clamp, 'function', 'typeof clamp === function');

  var arr = new Array(10).fill()
    .map(() => rand(-3, 3));

  arr.forEach((n) => {
    n = clamp(n, -1, 1);

    t.ok(n >= -1 && n <= 1, `${n} >= -1 && ${n} <= 1`);
  });

  t.end();
});
