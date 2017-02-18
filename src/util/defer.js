
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
    this.isResolved = false;
    this.isRejected = false;
    this.resolveHandler = noop;
    this.rejectHandler = noop;
    this.progressHandlers = [];

    this.promise = new Promise((resolve, reject) => {
      this.resolveHandler = resolve;
      this.rejectHandler = reject;
    });

    this.promise.progress = (callback) => {
      if (this.isResolved) return this.promise;
      if (typeof callback === 'function') {
        this.progressHandlers.push(callback);
      }
      return this.promise;
    };
  }

  resolve (val) {
    if (this.isResolved) return;
    this.isResolved = true;
    this.resolveHandler(val);
  }

  reject (val) {
    if (this.isRejected) return;
    this.isRejected = true;
    this.rejectHandler(val);
  }

  notify (val) {
    if (this.isResolved || this.isRejected) return;
    this.progressHandlers.forEach((fn) => {
      asap(() => {
        fn(val);
      });
    });
  }

}
