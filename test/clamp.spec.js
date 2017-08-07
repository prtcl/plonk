
import test from 'tape';

import clamp from '../src/clamp';
import rand from '../src/rand';

test('clamp', (t) => {
  t.equals(typeof clamp, 'function', 'clamp is a function');

  const cases = [];
  for (let i = 0; i < 10; i++) {
    cases.push(rand(-1.25, 1.25));
  }

  for (let n of cases) {
    let res = clamp(n);
    t.ok(res >= 0 && res <= 1, `clamp(${n}) equals ${res}`);
  }

  for (let n of cases) {
    let res = clamp(n, -1, 1);
    t.ok(res >= -1 && res <= 1, `clamp(${n}, -1, 1) equals ${res}`);
  }

  t.end();
});
