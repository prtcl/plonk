
import test from 'tape';

import toMilliseconds from '../src/toMilliseconds';

test('toMilliseconds', (t) => {
  t.equal(typeof toMilliseconds, 'function', 'toMilliseconds is a function');

  const cases = [
    [[null], 0],
    [[void 0, 's', 10], 10],
    [['abc'], 0],
    [[100], 100],
    [['66ms'], 66],
    [[1, 's'], 1000],
    [['0.875s'], 875],
    [['1hz'], 1000],
    [['0.5hz'], 2000],
    [[2, 'hz'], 500],
    [['1m'], 60000],
    [['60fps'], 1000 / 60]
  ];

  cases
    .map((d) => [...d, toMilliseconds(...d[0])])
    .forEach((d) => {
      const [args, res, n] = d;

      t.equal(n, res, `toMilliseconds(${stringifyArgs(args)}) equals ${res}`);
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
