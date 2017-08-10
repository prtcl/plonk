
import test from 'tape';

import clamp from '../src/clamp';
import rand from '../src/rand';

test('clamp', (t) => {
  t.equals(typeof clamp, 'function', 'clamp is a function');

  const cases = [];
  for (let i = 0; i < 10; i++) {
    cases.push(rand(-1.25, 1.25));
  }

  cases
    .map((n) => [n, clamp(n)])
    .forEach((d) => {
      const [n, res] = d;
      t.ok(res >= 0 && res <= 1, `clamp(${n}) returns ${res} and is in 0...1`);
    });

  cases
    .map((n) => [n, clamp(n, -1, 1)])
    .forEach((d) => {
      const [n, res] = d;
      t.ok(res >= -1 && res <= 1, `clamp(${n}, -1, 1) returns ${res} and is in -1...1`);
    });

  t.end();
});
