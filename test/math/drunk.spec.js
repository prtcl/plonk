
import test from 'tape';

import drunk from '../../src/math/drunk';

test('math/drunk', (t) => {
  t.equal(typeof drunk, 'function', 'drunk is a function');

  const d = drunk(-10, 10, 0.1);
  t.equal(typeof d, 'function', 'drunk() is a function factory');

  const arr = new Array(10).fill()
    .map(() => d());

  var prev;
  arr.forEach((n, i) => {
    t.ok(n >= -10 && n <= 10, `${n} is in -10...10`);

    prev = arr[i - 1] || n;
    t.ok(n >= prev - 1 && n <= prev + 1, `${n} is in ${prev - 1}...${prev + 1}`);
  });

  t.end();
});
