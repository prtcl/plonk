
import once from './once';

//
// Super minimal Promise class that also impliments progress/notify
//
// Notes about this implimentation:
//
//   * setTimeout is used instead of a microtask queue so that animation rendering is not interrupted by a higher priority task.
//       the behavior of setTimeout is also fairly uniform across environments (node, web workers, etc),
//       whereas asap-style implimentations are not.
//   * for the sake of speed, and since it's not outlined in the A+ spec, there is _no_ error handling in progress/notify methods!
//

export const PENDING = {};
export const FULFILLED = {};
export const REJECTED = {};

export default class Promise {

  constructor (resolver) {
    if (typeof this !== 'object') {
      return new Promise(resolver);
    }

    this._done = false;
    this._state = PENDING;
    this._value = null;
    this._handlers = [];

    if (typeof resolver === 'function') {
      initializeResolver(this, resolver);
    }
  }

  done (...args) {
    subscribe(this, ...args);

    if (this._state !== PENDING) {
      publish(this);
    }

    return this;
  }

  then (onResolved, onRejected, onNotify) {
    const p = new Promise();

    this.done(
      createResolve(p, onResolved),
      createReject(p, onRejected),
      onNotify
      );

    return p;
  }

  catch (onRejected) {
    return this.then(null, onRejected);
  }

  progress (fn) {
    if (typeof fn === 'function') {
      subscribe(this, null, null, fn);
    }

    return this;
  }

}

export function resolve (promise, val) {

  if (promise === val) {
    let err = new TypeError('Cannot resolve a promise with itself');
    return reject(promise, err);
  }

  if (val && (typeof val === 'object' || typeof val === 'function')) {
    let then;

    try {
      then = val.then;
    } catch (err) {
      return reject(promise, err);
    }

    if (then && typeof then === 'function') {
      return initializeResolver(promise, then.bind(val));
    }
  }

  fulfill(promise, val);
}

export function fulfill (promise, val) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._done = true;
  promise._state = FULFILLED;
  promise._value = val;
}

export function reject (promise, val) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._done = true;
  promise._state = REJECTED;
  promise._value = val;
}

export function progress (promise, val) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._value = val;
}

export function initializeResolver (promise, resolver) {
  try {
    resolver(
      ...once(createResolve(promise), createReject(promise)),
      createNotify(promise)
      );
  } catch (err) {
    reject(promise, err);
    publish(promise);
  }
}

export function createResolve (promise, onResolved) {
  return function (...args) {
    if (promise._done) return;

    if (typeof onResolved === 'function') {
      try {
        const res = onResolved(...args);
        resolve(promise, res);
      } catch (err) {
        reject(promise, err);
      }
    } else {
      resolve(promise, ...args);
    }

    if (promise._state !== PENDING) {
      publish(promise);
    }
  };
}

export function createReject (promise, onRejected) {
  return function (...args) {
    if (promise._done) return;

    if (typeof onRejected === 'function') {
      try {
        const res = onRejected(...args);
        resolve(promise, res);
      } catch (err) {
        reject(promise, err);
      }
    } else {
      reject(promise, ...args);
    }

    if (promise._state !== PENDING) {
      publish(promise);
    }
  };
}

export function createNotify (promise) {
  return function (...args) {
    if (promise._done) return;

    progress(promise, ...args);
    publish(promise);
  };
}

export class Handler {

  constructor (onResolved, onRejected, onNotify) {
    this.onResolved = typeof onResolved === 'function' ? once(onResolved) : null;
    this.onRejected = typeof onRejected === 'function' ? once(onRejected) : null;
    this.onNotify = typeof onNotify === 'function' ? onNotify : null;
  }

}

export function subscribe (promise, ...args) {
  promise._handlers.push(new Handler(...args));
}

export function publish (promise) {
  let method;

  switch (promise._state) {
    case PENDING:
      method = 'onNotify';
      break;
    case FULFILLED:
      method = 'onResolved';
      break;
    case REJECTED:
      method = 'onRejected';
      break;
    default:
      method = 'onNotify';
  }

  const val = promise._value;

  setTimeout(() => {
    promise._handlers.forEach((h) => {
      const fn = h[method];
      fn && fn(val);
    });
  }, 0);
}
