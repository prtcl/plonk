
import test from 'tape';

import Promise, {
  PENDING,
  FULFILLED,
  REJECTED,
  resolve,
  fulfill,
  reject,
  progress,
  Handler,
  subscribe,
  publish
} from '../../src/util/promise';

const values = new Map([
  [null, null],
  [undefined, undefined],
  [false, false],
  [1, 1],
  ['abc', 'abc'],
  ['{}', {}]
]);

test('util/promise', (t) => {

  t.equal(typeof PENDING, 'symbol', 'PENDING is a symbol');
  t.equal(typeof FULFILLED, 'symbol', 'FULFILLED is a symbol');
  t.equal(typeof REJECTED, 'symbol', 'REJECTED is a symbol');
  t.equal(typeof Promise, 'function', 'Promise is a function');

  let n = 0;

  const p = new Promise((a, b, c) => {
    t.ok(typeof a === 'function', 'Promise(resolver) receives a resolve function');
    t.ok(typeof b === 'function', 'Promise(resolver) receives a reject function');
    t.ok(typeof c === 'function', 'Promise(resolver) receives a notify function');

    n++;
  });

  t.ok(n === 1, 'Promise(resolver) is syncronous');

  t.equals(p._done, false, 'promise._done equals false');
  t.equals(p._state, PENDING, 'promise._state equals PENDING');
  t.equals(p._value, null, 'promise._value equals null');
  t.ok(typeof p._handlers === 'object' && p._handlers.length === 0, 'promise._handlers is an array');

  const METHODS = ['done', 'then', 'progress', 'catch'];

  METHODS.forEach((method) => {
    t.equals(typeof p[method], 'function', `promise.${method} is a function`);
  });

  t.end();
});

test('util/promise (mutations)', (t) => {
  t.equals(typeof progress, 'function', 'progress is a function');

  for (let [key, val] of values) {
    const p = new Promise();
    progress(p, val);
    t.equals(p._value, val, `progress(promise, ${key}) correctly sets promise._value while promise._state is PENDING`);

    p._state = FULFILLED;
    p._done = true;
    p._value = 1;
    progress(p, val);
    t.equals(p._value, 1, `progress(promise, ${key}) bails out when promise._state is not PENDING`);
  }

  t.equals(typeof fulfill, 'function', 'fulfill is a function');

  for (let [key, val] of values) {
    const p = new Promise();
    fulfill(p, val);
    t.equals(p._value, val, `fulfill(promise, ${key}) correctly fulfills the promise while promise._state is PENDING`);

    fulfill(p, 2);
    t.ok(p._value === val && p._state === FULFILLED, `fulfill(promise, ${key}) bails out when promise._state is not PENDING`);
  }

  t.equals(typeof reject, 'function', 'reject is a function');

  for (let [key, val] of values) {
    const p = new Promise();
    reject(p, val);
    t.ok(p._value === val && p._state === REJECTED, `reject(promise, ${key}) correctly rejects the promise while promise._state is PENDING`);

    reject(p, new Error());
    t.ok(p._value === val && p._state === REJECTED, `reject(promise, ${key}) bails out when promise._state is not PENDING`);
  }

  t.end();
});

test('util/promise (resolve)', (t) => {

  t.equals(typeof resolve, 'function', 'resolve is a function');

  for (let [key, val] of values) {
    const p = new Promise();
    resolve(p, val);
    t.ok(p._value === val && p._state === FULFILLED, `resolve(promise, ${key}) correctly fulfills promise with ${typeof val} value`);
  }

  let p;
  p = new Promise();
  resolve(p, p);
  t.ok(p._state === REJECTED && p._value.message === 'Cannot resolve a promise with itself', 'resolve(promise, promise) cannot resolve a promise with itself');

  p = new Promise();
  resolve(p, {
    get then () {
      throw new Error('bonk');
    }
  });
  t.ok(p._state === REJECTED && p._value.message === 'bonk', 'resolve(promise, badThenable) correctly rejects promise when a thenable is passed as value but thenable.then retrieval throws an error');

  let isThenable = false;
  const thenable = {
    then (a, b, c) {
      t.equals(typeof a, 'function', 'thenable.then receives a resolve function');
      t.equals(typeof b, 'function', 'thenable.then receives a reject function');
      t.equals(typeof c, 'function', 'thenable.then receives a notify function');
      isThenable = true;
    }
  };

  p = new Promise();
  resolve(p, thenable);
  t.ok(isThenable, 'resolve(promise, thenable) correctly treats thenable.then as a resolver function');

  t.end();
});

test('util/promise (handler)', (t) => {
  const METHODS = ['onResolved', 'onRejected', 'onNotify'];
  let h;

  t.equals(typeof Handler, 'function', 'Handler is a function');

  h = new Handler();
  METHODS.forEach((method) => {
    t.equals(h[method], null, `handler.${method} is null when no arguments are passed in to constructor`);
  });

  h = new Handler(1, true, 'abc');
  METHODS.forEach((method) => {
    t.equals(h[method], null, `handler.${method} is null when non-function arguments are passed in to constructor`);
  });

  let n = 0;
  h = new Handler((v) => (n = v), (v) => (n = v), (v) => (n = v));
  METHODS.forEach((method) => {
    t.equals(typeof h[method], 'function', `handler.${method} is a function when function arguments are passed in to constructor`);
  });

  h.onResolved(1);
  t.equals(n, 1, 'handler.onResolved calls correctly');

  h.onResolved(0);
  t.equals(n, 1, 'handler.onResolved can only be called once');

  h.onRejected(2);
  t.equals(n, 2, 'handler.onRejected calls correctly');

  h.onRejected(0);
  t.equals(n, 2, 'handler.onRejected can only be called once');

  h.onNotify(1);
  t.equals(n, 1, 'handler.onNotify calls correctly');

  h.onNotify(2);
  t.equals(n, 2, 'handler.onNotify can be called multiple times');

  t.end();
});

test('util/promise (pubsub)', (t) => {
  t.plan(6);

  let p;

  t.equal(typeof subscribe, 'function', 'subscribe is a function');
  t.equal(typeof publish, 'function', 'publish is a function');

  p = new Promise();
  subscribe(p,
    (val) => {
      t.equal(val, 3, 'publish(promise) correctly notifies resolve handlers');
    },
    (val) => {
      t.equal(val, 2, 'publish(promise) correctly notifies reject handlers');
    },
    (val) => {
      t.equal(val, 1, 'publish(promise) correctly notifies progress handlers');
    }
    );
  t.ok(p._handlers.length === 1 && p._handlers[0] instanceof Handler, 'subscribe(promise, ...handlers) correctly adds a Handler');

  p._value = 1;
  publish(p);

  p._state = REJECTED;
  p._value = 2;
  publish(p);

  p._state = FULFILLED;
  p._value = 3;
  publish(p);

});

test('util/promise (chaining)', (t) => {

  let n = 0;

  function createTimerPromise () {
    return new Promise((a, b, c) => {
      let i = 0;
      const id = setInterval(() => {
        n++;
        i++;
        if (i === 10) {
          clearTimeout(id);
          a(n);
        } else {
          c(n);
        }
      }, 1000 / 16);
    });
  }

  let p1 = 0,
      p2 = 10;

  createTimerPromise()
    .progress((val) => {
      p1++;
      t.equal(p1, n, `p1 progress: ${val}`);
    })
    .then((val) => {
      p1++;
      t.equal(p1, n, `p1 then: ${val}`);

      return createTimerPromise();
    })
    .progress((val) => {
      p2++;
      t.equal(p2, n, `p2 progress: ${val}`);
    })
    .then((val) => {
      p2++;
      t.equal(p2, n, `p2 then: ${val}`);

      t.end();
    });

});
