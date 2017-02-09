
import test from 'tape';

import noop from '../../src/util/noop';

test('util/noop', (t) => {
  t.equal(typeof noop, 'function', 'noop is a function');

  t.end();
});
