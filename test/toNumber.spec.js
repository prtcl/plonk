
import test from 'tape';

import toNumber from '../src/toNumber';

test('toNumber', (t) => {
  t.equal(typeof toNumber, 'function', 'toNumber is a function');

  const cases = [
    [[10], 10],
    [['10'], 10],
    [[void 0, 10], 10],
    [['a2'], 0],
    [[false, 0], 0],
    [[{}, 0], 0]
  ];

  for (let [args, res] of cases) {
    let sArgs = args
      .map((d) => {
        if (typeof d !== 'number') {
          return `'${d}'`;
        }
        return d;
      })
      .join(', ');

    t.equal(toNumber(...args), res, `toNumber(${sArgs}) equals ${res}`);
  }

  t.end();
});
