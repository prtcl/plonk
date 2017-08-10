
import test from 'tape';

import once from '../src/_once';

test('once', (t) => {
  t.equal(typeof once, 'function', 'once is a function');

  let n = 0;
  const onced = once(() => ++n);

  t.equal(typeof onced, 'function', 'once returns a function');
  t.equal(n, 0, 'n equals 0');
  t.equal(onced(), 1, 'n equals 1');
  t.equal(onced(), 1, 'n equals 1');

  let fns = once(() => 1, () => 1, () => 1);
  t.ok(typeof fns === 'object' && fns.length === 3, 'once(fn, fn, fn) returns an array');

  fns.forEach((fn) => {
    t.equal(typeof fn, 'function', 'fn is a function');
  });

  n = 0;
  let [fn1, fn2, fn3] = once(
    (v) => (n = v),
    (v) => (n = v),
    (v) => (n = v)
    );

  fn2(2);
  t.equal(n, 2, 'fn2(2) sets n to 2');

  n = 0;

  t.equal(fn1(1), undefined, 'fn1(1) returns undefined');
  t.equal(fn2(2), 2, 'fn2(2) returns 2');
  t.equal(fn3(3), undefined, 'fn3(3) returns undefined');
  t.equal(n, 0, 'n equals 0');

  n = 0;

  [fn1, fn2] = once(
    (v) => (n = v),
    null
    );

  fn2();
  fn1(1);
  fn1(2);

  t.equal(n, 0, 'once still applies to non-function arguments');

  t.end();
});
