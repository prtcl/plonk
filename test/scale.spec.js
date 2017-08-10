
import test from 'tape';

import scale from '../src/scale';

test('scale', (t) => {
  t.equal(typeof scale, 'function', 'scale is a function');

  const cases = [
    [[0.5, 0, 1, -1, 1], 0],
    [[-0.876234, -1, 1, 0, 32], 1.9802560000000007],
    [[0.32, -1, 1, -100, 0], -34],
    [[3.5, -1, 1, 0, 1], 1]
  ];

  cases
    .map((d) => [...d, scale(...d[0])])
    .forEach((d) => {
      const [args, res, n] = d;

      t.equal(n, res, `scale(${args.join(', ')}) equals ${res}`);
    });

  t.end();
});
