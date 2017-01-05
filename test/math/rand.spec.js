
import test from 'tape';

import rand from '../../lib/math/rand';

test('math/rand', (t) => {
  t.equal(typeof rand, 'function', 'rand is a function');

  const arr = new Array(10).fill();
  arr.forEach(() => {
    var n = rand(-1, 1);
    t.ok(n >= -1 && n <= 1, `${n} is in -1...1`);
  });
  arr.forEach(() => {
    var n = rand();
    t.ok(n >= 0 && n <= 1, `${n} is in 0...1`);
  });
  arr.forEach(() => {
    var n = rand(30);
    t.ok(n >= 0 && n <= 30, `${n} is in 0...30`);
  });

  t.end();
});
