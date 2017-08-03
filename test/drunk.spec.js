
import test from 'tape';

import drunk from '../src/drunk';

test('drunk', (t) => {
  t.equal(typeof drunk, 'function', 'drunk is a function');

  const d = drunk(-1, 1, 0.1);

  t.equal(typeof d, 'function', 'drunk() is a function factory');

  const cases = new Array(20)
    .fill()
    .map(() => d());

  let min = -1,
      max = 1,
      step = 0.1,
      prev;

  for (let [i, n] of cases.entries()) {
    t.ok(n >= min && n <= max, `${n} is in ${min}...${max}`);

    prev = cases[i - 1] || n;

    let pMin = Math.max(prev - step, min),
        pMax = Math.min(prev + step, max);

    t.ok(n >= pMin && n <= pMax, `${n} is in ${pMin}...${pMax}`);
  }

  t.end();
});
