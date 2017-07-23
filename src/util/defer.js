
import Promise from './promise';

// A basic Deferred class that is used for all promises internally
// It's exposed as plonk.defer, but not documented, since plonk is not trying to be a promise library

export default function defer () {
  return new Deferred();
}

export class Deferred {

  constructor () {
    this.promise = new Promise((resolve, reject, notify) => {
      this.resolve = (...args) => resolve(...args);
      this.reject = (...args) => reject(...args);
      this.notify = (...args) => notify(...args);
    });
  }

}
