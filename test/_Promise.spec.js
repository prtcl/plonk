
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
  subscribe,
  publish
} from '../src/_promise';

const values = [
  [null, null],
  [undefined, undefined],
  [false, false],
  [1, 1],
  ['abc', 'abc'],
  ['{}', {}]
];

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

  t.equal(p._done, false, 'promise._done equals false');
  t.equal(p._state, PENDING, 'promise._state equals PENDING');
  t.equal(p._value, null, 'promise._value equals null');
  t.equal(typeof p._h, 'object', 'promise._h is an object');

  ['res', 'rej', 'prog'].forEach((handler) => {
    const arr = p._h[handler];
    t.ok(typeof arr === 'object' && ('length' in arr) && arr.length === 0, `promise._h.${handler} is an array`);
  });

  const METHODS = ['done', 'then', 'progress', 'catch'];

  METHODS.forEach((method) => {
    t.equal(typeof p[method], 'function', `promise.${method} is a function`);
  });

  t.end();
});

test('Promise (mutations)', (t) => {
  t.equal(typeof progress, 'function', 'progress is a function');

  values
    .map((d) => [...d, new Promise()])
    .forEach((d) => {
      const [key, val, p] = d;

      progress(p, val);
      t.equal(p._value, val, `progress(promise, ${key}) correctly sets promise._value while promise._state is PENDING`);

      p._state = FULFILLED;
      p._done = true;
      p._value = 1;
      progress(p, val);
      t.equal(p._value, 1, `progress(promise, ${key}) bails out when promise._state is not PENDING`);
    });

  t.equal(typeof fulfill, 'function', 'fulfill is a function');

  values
    .map((d) => [...d, new Promise()])
    .forEach((d) => {
      const [key, val, p] = d;

      fulfill(p, val);
      t.equal(p._value, val, `fulfill(promise, ${key}) correctly fulfills the promise while promise._state is PENDING`);

      fulfill(p, 2);
      t.ok(p._value === val && p._state === FULFILLED, `fulfill(promise, ${key}) bails out when promise._state is not PENDING`);
    });

  t.equal(typeof reject, 'function', 'reject is a function');

  values
    .map((d) => [...d, new Promise()])
    .forEach((d) => {
      const [key, val, p] = d;

      reject(p, val);
      t.ok(p._value === val && p._state === REJECTED, `reject(promise, ${key}) correctly rejects the promise while promise._state is PENDING`);

      reject(p, new Error());
      t.ok(p._value === val && p._state === REJECTED, `reject(promise, ${key}) bails out when promise._state is not PENDING`);
    });

  t.end();
});

test('Promise (resolve)', (t) => {

  t.equal(typeof resolve, 'function', 'resolve is a function');

  values
    .map((d) => [...d, new Promise()])
    .forEach((d) => {
      const [key, val, p] = d;

      resolve(p, val);
      t.ok(p._value === val && p._state === FULFILLED, `resolve(promise, ${key}) correctly fulfills promise with ${typeof val} value`);
    });

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
      t.equal(typeof a, 'function', 'thenable.then receives a resolve function');
      t.equal(typeof b, 'function', 'thenable.then receives a reject function');
      t.equal(typeof c, 'function', 'thenable.then receives a notify function');
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

  let res;

  res = createNotify(new Promise());
  t.equal(typeof res, 'function', 'createNotify(promise) returns a function');

  values
    .map((d) => [...d, new Promise()])
    .forEach((d) => {
      const [key, val, p] = d;

      p.progress((v) => {
        t.equal(v, val, `createNotify(promise)(${key}) correctly notifies promise`);
      });

      createNotify(p)(val);
    });

  res = createResolve(new Promise());
  t.equal(typeof res, 'function', 'createResolve(promise) returns a function');

  values
    .map((d) => [...d, new Promise()])
    .forEach((d) => {
      const [key, val, p] = d;

      createResolve(p)(val);

      p.then((v) => {
        t.equal(v, val, `createResolve(promise)(${key}) correctly resolves promise`);
      });
    });

  values
    .map((d) => [...d, new Promise()])
    .forEach((d) => {
      const [key, val, p] = d;

      createResolve(p, (v) => v)(val);

      p.then((v) => {
        t.equal(v, val, `createResolve(promise, (val) => val)(${key}) correctly resolves promise`);
      });
    });

  values
    .map((d) => [...d, new Promise()])
    .forEach((d) => {
      const [key, val, p] = d;

      createResolve(p, (v) => {
        throw v;
      })(val);

      p.catch((v) => {
        t.equal(v, val, `createResolve(promise, (val) => throw val)(${key}) correctly rejects promise`);
      });
    });

  res = createReject(new Promise());
  t.equal(typeof res, 'function', 'createReject(promise) returns a function');

  values
    .map((d) => [...d, new Promise()])
    .forEach((d) => {
      const [key, val, p] = d;

      createReject(p)(val);

      p.catch((v) => {
        t.equal(v, val, `createReject(promise)(${key}) correctly rejects promise`);
      });
    });

  values
    .map((d) => [...d, new Promise()])
    .forEach((d) => {
      const [key, val, p] = d;

      createReject(p, (v) => v)(val);

      p.then((v) => {
        t.equal(v, val, `createReject(promise, (val) => val)(${key}) correctly resolves promise`);
      });
    });

  values
    .map((d) => [...d, new Promise()])
    .forEach((d) => {
      const [key, val, p] = d;

      createReject(p, (v) => {
        throw v;
      })(val);

      p.catch((v) => {
        t.equal(v, val, `createReject(promise, (val) => throw val)(${key}) correctly rejects promise`);
      });
    });

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

test('Promise (pubsub)', (t) => {
  t.plan(24);

  let p;

  t.equal(typeof subscribe, 'function', 'subscribe is a function');
  t.equal(typeof publish, 'function', 'publish is a function');

  p = new Promise();

  subscribe(p);

  t.equal(p._h.res.length, 0, 'subscribe(promise) does not add a resolved handler');
  t.equal(p._h.rej.length, 0, 'subscribe(promise) does not add a rejected handler');
  t.equal(p._h.prog.length, 0, 'subscribe(promise) does not add a progress handler');

  let res = 0;
  p = new Promise();

  subscribe(p, () => {
    res++;
    t.equal(res, 1, 'resolved handler can only be called once');
  });

  t.equal(p._h.res.length, 1, 'subscribe(promise, fn, null, null) adds a resolved handler');
  t.equal(typeof p._h.res[0], 'function', 'resolved handler is a function');
  t.equal(p._h.rej.length, 0, 'subscribe(promise, fn, null, null) does not add a rejected handler');
  t.equal(p._h.prog.length, 0, 'subscribe(promise, fn, null, null) does not add a progress handler');

  p._state = FULFILLED;
  publish(p);
  publish(p);

  let rej = 0;
  p = new Promise();

  subscribe(p, null, () => {
    rej++;
    t.equal(rej, 1, 'rejected handler can only be called once');
  });

  t.equal(p._h.rej.length, 1, 'subscribe(promise, null, fn, null) adds a rejected handler');
  t.equal(typeof p._h.rej[0], 'function', 'rejected handler is a function');
  t.equal(p._h.res.length, 0, 'subscribe(promise, null, fn, null) does not add a resolved handler');
  t.equal(p._h.prog.length, 0, 'subscribe(promise, null, fn, null) does not add a progress handler');

  p._state = REJECTED;
  publish(p);
  publish(p);

  let prog = 0;
  p = new Promise();

  subscribe(p, null, null, (val) => {
    prog++;
    t.equal(prog, val, 'notified handler can be called more than once');
  });

  t.equal(p._h.prog.length, 1, 'subscribe(promise, null, null, fn) adds a progress handler');
  t.equal(typeof p._h.prog[0], 'function', 'progress handler is a function');
  t.equal(p._h.res.length, 0, 'subscribe(promise, null, null, fn) does not add a resolved handler');
  t.equal(p._h.rej.length, 0, 'subscribe(promise, null, null, fn) does not add a rejected handler');

  p._value = 1;
  publish(p);
  p._value = 2;
  publish(p);

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
  t.plan(24);

  let p, res;

  p = new Promise();
  res = p.done(() => 1, () => 1, () => 1);
  t.equal(p, res, 'promise.done() returns this');
  t.equal(p._h.prog.length, 1, 'promise.done() adds a progress handler');
  t.equal(p._h.res.length, 1, 'promise.done() adds a resolved handler');
  t.equal(p._h.rej.length, 1, 'promise.done() adds a rejected handler');

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

  t.equal(p._h.prog.length, 1, 'promise.then() adds a progress handler');
  t.equal(p._h.res.length, 1, 'promise.then() adds a resolved handler');
  t.equal(p._h.rej.length, 1, 'promise.then() adds a rejected handler');

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
  t.equal(p._h.rej.length, 1, 'promise.catch() adds a rejected handler');
  t.equal(p._h.res.length, 1, 'promise.catch() adds a resolved handler');
  t.equal(p._h.prog.length, 0, 'promise.catch() does not add a progress handler');

  p = new Promise();
  p.catch((val) => {
    t.equal(val, 1, 'promise.catch(onRejected) is called when promise is rejected');
  });
  createReject(p)(1);

  p = new Promise();
  res = p.progress(() => 1);
  t.equal(p, res, 'promise.progress() returns this');
  t.equal(p._h.prog.length, 1, 'promise.progress() adds a progress handler');
  t.equal(p._h.res.length, 0, 'promise.progress() does not add a resolved handler');
  t.equal(p._h.rej.length, 0, 'promise.progress() does not add a rejected handler');

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
      t.equal(p1, n, `p1 progress ${val}`);
    })
    .then((val) => {
      p1++;
      t.equal(p1, n, `p1 then ${val}`);

      return createTimerPromise();
    })
    .progress((val) => {
      p2++;
      t.equal(p2, n, `p2 progress ${val}`);
    })
    .then((val) => {
      p2++;
      t.equal(p2, n, `p2 then ${val}`);
    });

});
