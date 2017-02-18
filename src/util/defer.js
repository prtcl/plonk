
import asap from 'asap';
import Promise from 'promise/lib/es6-extensions';

import noop from './noop';

// A simple Deferred class that is used for all promises internally
// It's exposed as plonk.defer, but not documented, since plonk is not trying to be a promise library

export default function defer () {
  return new Deferred();
}

export class Deferred {

  constructor () {
    this._isResolved = false;
    this._isRejected = false;
    this._resolveHandler = noop;
    this._rejectHandler = noop;
    this.progressHandlers = [];

    this.promise = new _Promise((resolve, reject) => {
      this._resolveHandler = resolve;
      this._rejectHandler = reject;
    });
  }

  resolve (val) {
    if (this._isResolved) return;
    this._isResolved = true;
    this._resolveHandler(val);
  }

  reject (val) {
    if (this._isRejected) return;
    this._isRejected = true;
    this._rejectHandler(val);
  }

  notify (val) {
    if (this._isResolved || this._isRejected) return;
    notify(this.promise, val);
  }

}

export class _Promise extends Promise {

  constructor (...args) {
    super(...args);
    this._progressHandlers = [];
  }

  progress (callback) {
    this._progressHandlers || (this._progressHandlers = []);
    if (typeof callback === 'function') {
      this._progressHandlers.push(callback);
    }
    return this;
  }

  then (resolver) {
    const res = super.then((...args) => {
      const ret = resolver(...args);

      ret.progress((val) => {
        notify(promise, val);
      });

      return ret;
    });

    const promise = new _Promise((resolve, reject) => {
      res.then(resolve, reject);
    });

    return promise;
  }

}

function notify (promise, val) {
  if (!promise._progressHandlers) return;
  asap(() => {
    promise._progressHandlers.forEach((fn) => {
      fn(val);
    });
  });
}
