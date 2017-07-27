
import test from 'tape';

import noop from '../src/_noop';

test('noop', (t) => {
  t.equal(typeof noop, 'function', 'noop is a function');

  t.end();
});
