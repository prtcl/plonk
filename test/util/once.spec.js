
import test from 'tape';

import once from '../../src/util/once';

test('util/once', (t) => {
  t.equal(typeof once, 'function', 'once is a function');

  let n = 0;
  const onced = once(() => ++n);

  t.equals(typeof onced, 'function', 'once returns a function');
  t.equal(n, 0, 'n equals 0');
  t.equal(onced(), 1, 'n equals 1');
  t.equal(onced(), 1, 'n equals 1');

  t.end();
});
