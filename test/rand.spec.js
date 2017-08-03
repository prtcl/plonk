
import test from 'tape';

import rand from '../src/rand';

test('rand', (t) => {
  t.equal(typeof rand, 'function', 'rand is a function');

  for (let i = 0; i < 10; i++) {
    let n = rand(-1, 1);
    t.ok(n >= -1 && n <= 1, `rand(-1, 1) equals ${n}`);
  }

  for (let i = 0; i < 10; i++) {
    let n = rand();
    t.ok(n >= 0 && n <= 1, `rand() equals ${n}`);
  }

  for (let i = 0; i < 10; i++) {
    let n = rand(30);
    t.ok(n >= 0 && n <= 30, `rand(30) equals ${n}`);
  }

  t.end();
});
