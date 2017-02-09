
import test from 'tape';

import toMilliseconds, { FORMAT_IDENTIFIERS } from '../../src/util/toMilliseconds';

test('util/toMilliseconds', (t) => {
  t.equal(typeof toMilliseconds, 'function', 'toMilliseconds is a function');

  t.deepEqual(FORMAT_IDENTIFIERS, ['hz', 'ms', 's', 'm'], `${FORMAT_IDENTIFIERS} equals ${['hz', 'ms', 's', 'm'].join(',')}`);

  t.equal(toMilliseconds(null), 0, 'toMilliseconds(null) equals 0');
  var n;
  t.equal(toMilliseconds(n, 's', 10), 10, 'toMilliseconds(n, \'s\', 10) equals 10');
  t.equal(toMilliseconds('abc'), 0, 'toMilliseconds(\'abc\') equals 0');
  t.equal(toMilliseconds(100), 100, 'toMilliseconds(100) equals 100');
  t.equal(toMilliseconds('66ms'), 66, 'toMilliseconds(\'66ms\') equals 66');
  t.equal(toMilliseconds(1, 's'), 1000, 'toMilliseconds(1, \'s\') equals 1000');
  t.equal(toMilliseconds('0.875s'), 875, 'toMilliseconds(\'0.875s\') equals 875');
  t.equal(toMilliseconds('1hz'), 1000, 'toMilliseconds(\'1hz\') equals 1000');
  t.equal(toMilliseconds('0.5hz'), 2000, 'toMilliseconds(\'0.5hz\') equals 2000');
  t.equal(toMilliseconds(2, 'hz'), 500, 'toMilliseconds(2, \'hz\') equals 500');
  t.equal(toMilliseconds('1m'), 60000, 'toMilliseconds(\'1m\') equals 60000');

  t.end();
});
