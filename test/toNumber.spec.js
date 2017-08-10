
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

  cases
    .map((d) => [...d, toNumber(...d[0])])
    .forEach((d) => {
      const [args, res, n] = d;

      t.equal(n, res, `toNumber(${stringifyArgs(args)}) equals ${res}`);
    });

  t.end();
});

function stringifyArgs (args) {
  return args
    .map((d) => {
      if (typeof d !== 'number') {
        return `'${d}'`;
      }
      return d;
    })
    .join(', ');
}
