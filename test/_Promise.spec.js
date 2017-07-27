
import test from 'tape';

import Promise, {
  PENDING,
  FULFILLED,
  REJECTED,
  resolve,
  fulfill,
  reject,
  progress,
  initializeResolver,
  createResolve,
  createReject,
  createNotify,
  Handler,
  subscribe,
  publish
} from '../src/_promise';

const values = new Map([
  [null, null],
  [undefined, undefined],
  [false, false],
  [1, 1],
  ['abc', 'abc'],
  ['{}', {}]
]);

test('Promise', (t) => {

  t.equal(typeof PENDING, 'object', 'PENDING is a object');
  t.equal(typeof FULFILLED, 'object', 'FULFILLED is a object');
  t.equal(typeof REJECTED, 'object', 'REJECTED is a object');
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

test('Promise (mutations)', (t) => {
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

test('Promise (resolve)', (t) => {

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
  t.ok(p._state === REJECTED && p._value.message === 'bonk', 'resolve(promise, badThenable) correctly rejects promise when a thenable is passed but thenable.then retrieval throws an error');

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

test('Promise (factories)', (t) => {
  t.plan(48);

  t.equal(typeof createNotify, 'function', 'createNotify is a function');
  t.equal(typeof createResolve, 'function', 'createResolve is a function');
  t.equal(typeof createReject, 'function', 'createReject is a function');

  let p, fn;

  p = new Promise();
  fn = createNotify(p);
  t.equal(typeof fn, 'function', 'createNotify(promise) returns a function');

  for (let [key, val] of values) {
    p = new Promise();
    createNotify(p)(val);
    p.progress((v) => {
      t.equal(v, val, `createNotify(promise)(${key}) correctly notifies promise`);
    });
  }

  p = new Promise();
  fn = createResolve(p);
  t.equal(typeof fn, 'function', 'createResolve(promise) returns a function');

  for (let [key, val] of values) {
    p = new Promise();
    createResolve(p)(val);
    p.then((v) => {
      t.equal(v, val, `createResolve(promise)(${key}) correctly resolves promise`);
    });
  }

  for (let [key, val] of values) {
    p = new Promise();
    createResolve(p, (v) => v)(val);
    p.then((v) => {
      t.equal(v, val, `createResolve(promise, (val) => val)(${key}) correctly resolves promise`);
    });
  }

  for (let [key, val] of values) {
    p = new Promise();
    createResolve(p, (v) => {
      throw v;
    })(val);
    p.catch((v) => {
      t.equal(v, val, `createResolve(promise, (val) => throw val)(${key}) correctly rejects promise`);
    });
  }

  p = new Promise();
  fn = createReject(p);
  t.equal(typeof fn, 'function', 'createReject(promise) returns a function');

  for (let [key, val] of values) {
    p = new Promise();
    fn = createReject(p)(val);
    p.catch((v) => {
      t.equal(v, val, `createReject(promise)(${key}) correctly rejects promise`);
    });
  }

  for (let [key, val] of values) {
    p = new Promise();
    createReject(p, (v) => v)(val);
    p.then((v) => {
      t.equal(v, val, `createReject(promise, (val) => val)(${key}) correctly resolves promise`);
    });
  }

  for (let [key, val] of values) {
    p = new Promise();
    createReject(p, (v) => {
      throw v;
    })(val);
    p.catch((v) => {
      t.equal(v, val, `createReject(promise, (val) => throw val)(${key}) correctly rejects promise`);
    });
  }

});

test('Promise (initialize)', (t) => {
  t.plan(12);

  t.equal(typeof initializeResolver, 'function', 'initializeResolver is a function');

  let p;

  p = new Promise();
  p.then(null, (val) => {
    t.ok(val instanceof Error, 'error thrown in resolver rejects promise');
  });
  initializeResolver(p, (a, b, c) => {
    t.equal(typeof a, 'function', 'initializeResolver(promise, resolver) receives a resolve function');
    t.equal(typeof b, 'function', 'initializeResolver(promise, resolver) receives a resolve function');
    t.equal(typeof c, 'function', 'initializeResolver(promise, resolver) receives a resolve function');

    throw new Error();
  });

  p = new Promise();
  p.then((val) => {
    t.equal(val, 1, 'resolver(resolve) correctly resolves promise');
  });
  initializeResolver(p, (a) => {
    a(1);
  });

  p = new Promise();
  p.then(null, (val) => {
    t.equal(val, 1, 'resolver(reject) correctly rejects promise');
  });
  initializeResolver(p, (a, b) => {
    b(1);
  });

  p = new Promise();
  p.then(null, null, (val) => {
    t.equal(val, 1, 'resolver(notify) correctly notifies promise');
  });
  initializeResolver(p, (a, b, c) => {
    c(1);
  });

  p = new Promise();
  p.then(
    (val) => {
      t.equal(val, 1, 'resolver(resolve) and resolver(reject) can only be called once');
    },
    (val) => {
      t.equal(val, 1);
    }
    );
  initializeResolver(p, (a, b) => {
    a(1);
    a(2);
    b(0);
  });

  p = new Promise();
  p.then(
    (val) => {
      t.equal(val, 1);
    },
    (val) => {
      t.equal(val, 1, 'resolver(reject) and resolver(resolve) can only be called once');
    }
    );
  initializeResolver(p, (a, b) => {
    b(1);
    b(2);
    a(0);
  });

  let n = 0;
  p = new Promise();
  p.then(null, null, (val) => {
    t.equal(val, n, 'resolver(notify) can be called multiple times');
    n++;
  });
  initializeResolver(p, (a, b, c) => {
    c(n);
    setTimeout(() => {
      c(n);
    }, 50);
  });

});

test('Promise (handler)', (t) => {
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

test('Promise (pubsub)', (t) => {
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

test('Promise (methods)', (t) => {
  t.plan(28);

  let p, res, h;

  p = new Promise();
  res = p.done(() => 1, () => 1, () => 1);
  t.equal(p, res, 'promise.done() returns this');

  t.equal(p._handlers.length, 1, 'promise.done() adds a Handler to promise._handlers');
  h = p._handlers[0];
  ['onResolved', 'onRejected', 'onNotify'].forEach((m) => {
    t.equal(typeof h[m], 'function', `handler.${m} is a function`);
  });

  p = new Promise();
  p.done((val) => {
    t.equal(val, 1, 'promise.done(onResolved) is called when promise is resolved');
  });
  createResolve(p)(1);

  p = new Promise();
  p.done(null, (val) => {
    t.equal(val, 1, 'promise.done(onRejected) is called when promise is rejected');
  });
  createReject(p)(1);

  p = new Promise();
  p.done(null, null, (val) => {
    t.equal(val, 1, 'promise.done(onNotify) is called when promise is notified');
  });
  createNotify(p)(1);

  p = new Promise();
  res = p.then(() => 1, () => 1, () => 1);
  t.ok(res instanceof Promise, 'promise.then() returns a Promise');

  t.equal(p._handlers.length, 1, 'promise.then() adds a Handler to promise._handlers');
  h = p._handlers[0];
  ['onResolved', 'onRejected', 'onNotify'].forEach((m) => {
    t.equal(typeof h[m], 'function', `handler.${m} is a function`);
  });

  p = new Promise();
  p.then((val) => {
    t.equal(val, 1, 'promise.then(onResolved) is called when promise is resolved');
  });
  createResolve(p)(1);

  p = new Promise();
  p.then(null, (val) => {
    t.equal(val, 1, 'promise.then(onRejected) is called when promise is rejected');
  });
  createReject(p)(1);

  p = new Promise();
  p.then(null, null, (val) => {
    t.equal(val, 1, 'promise.then(onNotify) is called when promise is notified');
  });
  createNotify(p)(1);

  p = new Promise();
  res = p.catch(() => 1);
  t.ok(res instanceof Promise, 'promise.catch() returns a Promise');

  t.equal(p._handlers.length, 1, 'promise.catch() adds a Handler to promise._handlers');
  h = p._handlers[0];
  t.equal(typeof h.onResolved, 'function', 'handler.onResolved is a function');
  t.equal(typeof h.onRejected, 'function', 'handler.onRejected is a function');
  t.equal(h.onNotify, null, 'handler.onNotify is null');

  p = new Promise();
  p.catch((val) => {
    t.equal(val, 1, 'promise.catch(onRejected) is called when promise is rejected');
  });
  createReject(p)(1);

  p = new Promise();
  res = p.progress(() => 1);
  t.equal(p, res, 'promise.progress() returns this');

  t.equal(p._handlers.length, 1, 'promise.progress() adds a Handler to promise._handlers');
  h = p._handlers[0];
  t.equal(h.onResolved, null, 'handler.onResolved is a null');
  t.equal(h.onRejected, null, 'handler.onRejected is a null');
  t.equal(typeof h.onNotify, 'function', 'handler.onNotify is a function');

  p = new Promise();
  p.progress((val) => {
    t.equal(val, 1, 'promise.progress(onNotify) is called when promise is notified');
  });
  createNotify(p)(1);

});

test('Promise (chaining)', (t) => {
  t.plan(20);

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
    });

});
