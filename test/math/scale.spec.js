
import test from 'tape';

import scale from '../../src/math/scale';

test('math/scale', (t) => {
  t.equal(typeof scale, 'function', 'scale is a function');

  t.equal(scale(0.5, 0, 1, -1, 1), 0, 'scale(0.5, 0, 1, -1, 1) equals 0');
  t.equal(scale(-0.876234, -1, 1, 0, 32), 1.9802560000000007, 'scale(-0.876234, -1, 1, 0, 32) equals 1.9802560000000007');
  t.equal(scale(0.32, -1, 1, -100, 0), -34, 'scale(0.32, -1, 1, -100, 0) equals -34');
  t.equal(scale(3.5, -1, 1, 0, 1), 1, 'scale(3.5, -1, 1, 0, 1) equals 1');

  t.end();
});
