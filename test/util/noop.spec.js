
import test from 'tape';

import noop from '../../lib/util/noop';

test('util/noop', (t) => {
  t.equal(typeof noop, 'function', 'typeof noop === function');

  t.end();
});
