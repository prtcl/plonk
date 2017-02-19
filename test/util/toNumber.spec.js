
import test from 'tape';

import toNumber from '../../src/util/toNumber';

test('util/toNumber', (t) => {
  t.equal(typeof toNumber, 'function', 'toNumber is a function');

  var x;
  t.equal(toNumber(10), 10, 'toNumber(10) equals 10');
  t.equal(toNumber('10'), 10, 'toNumber(\'10\') equals 10');
  t.equal(toNumber(x, 10), 10, 'toNumber(x, 10) equals 10');
  t.equal(toNumber('a2'), 0, 'toNumber(\'a2\') equals 0');
  t.equal(toNumber(false, 0), 0, 'toNumber(false, 0) equals 0');
  t.equal(toNumber([1, 2, 3], 0), 0, 'toNumber([1, 2, 3], 0) equals 0');

  t.end();
});
