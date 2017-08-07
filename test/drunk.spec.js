
import test from 'tape';

import drunk from '../src/drunk';

test('drunk', (t) => {
  t.equal(typeof drunk, 'function', 'drunk is a function');

  const d = drunk(-1, 1, 0.1);

  t.equal(typeof d, 'function', 'drunk() is a function factory');

  const cases = [];
  for (let i = 0; i < 20; i++) {
    cases.push(d());
  }

  let min = -1,
      max = 1,
      step = 0.1,
      prev;

  for (let i = 0; i < cases.length; i++) {
    let n = cases[i];

    t.ok(n >= min && n <= max, `${n} is in ${min}...${max}`);

    prev = cases[i - 1] || n;

    let pMin = Math.max(prev - step, min),
        pMax = Math.min(prev + step, max);

    t.ok(n >= pMin && n <= pMax, `${n} is in ${pMin}...${pMax}`);
  }

  t.end();
});
