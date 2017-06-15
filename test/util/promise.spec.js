
import test from 'tape';

import Promise, {
  pending,
  fulfilled,
  rejected,
  tryExecutor,
  getThenOrError,
  resolve,
  reject,
  notify
} from '../../src/util/promise';

test('util/promise', (t) => {
  t.equal(typeof pending, 'symbol', 'pending is a symbol');
  t.equal(typeof fulfilled, 'symbol', 'fulfilled is a symbol');
  t.equal(typeof rejected, 'symbol', 'rejected is a symbol');

  t.equal(typeof Promise, 'function', 'Promise is a function');

  let n = 0;

  let p = new Promise((res, rej, not) => {
    t.ok(typeof res === 'function', 'resolve is a function');
    t.ok(typeof rej === 'function', 'reject is a function');
    t.ok(typeof not === 'function', 'notify is a function');

    n++;
  });

  t.ok(n === 1, 'executor is syncronous');

  t.equals(p._state, pending, '_state equals pending');
  t.equals(p._value, null, '_value is null');
  t.ok(typeof p._progressHandlers === 'object' && p._progressHandlers.length === 0, '_progressHandlers is an array');

  t.ok(typeof p._resolve === 'function', '_resolve is a function');
  t.ok(typeof p._reject === 'function', '_reject is a function');
  t.ok(typeof p._notify === 'function', '_notify is a function');

  t.ok(typeof p.progress === 'function', 'progress is a function');
  t.ok(typeof p.then === 'function', 'then is a function');
  t.ok(typeof p.catch === 'function', 'catch is a function');

  let then, err, x;

  t.equal(typeof getThenOrError, 'function', 'getThenOrError is a function');

  [then, err] = getThenOrError(p);
  t.ok(then && !err, 'getThenOrError(Promise) is a thenable');

  [then, err] = getThenOrError({ a: true });
  t.ok(!then && !err, 'getThenOrError(Object) is not a thenable');

  [then, err] = getThenOrError(120);
  t.ok(!then && !err, 'getThenOrError(Number) is not a thenable');

  [then, err] = getThenOrError('string');
  t.ok(!then && !err, 'getThenOrError(String) is not a thenable');

  [then, err] = getThenOrError(null);
  t.ok(!then && err, 'getThenOrError(null) is not a thenable');

  [then, err] = getThenOrError(x);
  t.ok(!then && err, 'getThenOrError(undefined) is not a thenable');

  t.equal(typeof tryExecutor, 'function', 'tryExecutor is a function');

  p = new Promise();
  tryExecutor(p, () => {
    throw new Error();
  });

  t.ok(p._state === rejected && p._value instanceof Error, 'throw in tryExecutor rejects the promise');

  t.equal(typeof resolve, 'function', 'resolve is a function');

  p = new Promise();
  resolve(p, true);

  t.ok(p._state === fulfilled && p._value === true, 'resolve() correctly resolves promise');

  t.equal(typeof reject, 'function', 'reject is a function');

  p = new Promise();
  reject(p, new Error());

  t.ok(p._state === rejected && p._value instanceof Error, 'reject() correctly rejects promise');

  t.equal(typeof notify, 'function', 'notify is a function');

  t.end();

});
