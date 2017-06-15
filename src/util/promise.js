

// Bare bones Promise class that also impliments a progress() method


// Symbols for promise states
export const pending = Symbol('pending');
export const fulfilled = Symbol('fulfilled');
export const rejected = Symbol('rejected');


export default class Promise {

  constructor (executor) {
    if (typeof this !== 'object') {
      return new Promise(executor);
    }

    this._state = pending;
    this._value = null;
    this._progressHandlers = [];

    if (typeof executor === 'function') {
      tryExecutor(this, executor);
    }
  }

  _resolve (val) {
    resolve(this, val);
  }

  _reject (err) {
    reject(this, err);
  }

  _notify (val) {
    notify(this, val);
  }

  progress (handler) {
    if (typeof handler === 'function') {
      this._progressHandlers.push(handler);
    }
    return this;
  }

  then () {

    return this;
  }

  catch () {

    return this;
  }

}

export function tryExecutor (promise, executor) {
  try {
    executor(promise._resolve, promise._reject, promise._notify);
  } catch (err) {
    reject(promise, err);
  }
}

export function getThenOrError (obj) {
  let then = null,
      err = null;

  try {
    then = obj.then;
  } catch (e) {
    err = e;
  }

  return [then, err];
}

export function resolve (promise, val) {
  if (promise._state !== pending) {
    return;
  }

  promise._state = fulfilled;
  promise._value = val;
}

export function reject (promise, err) {
  if (promise._state !== pending) {
    return;
  }

  promise._state = rejected;
  promise._value = err;
}

export function notify (promise, val) {
  promise._progressHandlers.forEach((fn) => {
    fn(val);
  });
}
