
import test from 'tape';

import drunk from '../../lib/math/drunk';

test('math/drunk', (t) => {
  t.equal(typeof drunk, 'function', 'typeof drunk === function');

  const d = drunk(-10, 10, 0.1);
  t.equal(typeof d, 'function', 'typeof drunk(-10, 10) === function');

  var arr = new Array(10).fill()
    .map(() => d());

  var prev;
  arr.forEach((n, i) => {
    t.ok(n >= -10 && n <= 10, `${n} >= -10 && ${n} <= 10`);

    prev = arr[i - 1] || n;
    t.ok(n >= prev - 1 && n <= prev + 1, `${n} >= ${prev - 1} && ${n} <= ${prev + 1}`);
  });

  t.end();
});
