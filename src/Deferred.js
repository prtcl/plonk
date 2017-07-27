
import Promise from './_Promise';

// A basic Deferred class that is used for all promises internally

export default class Deferred {

  constructor () {
    this.promise = new Promise((resolve, reject, notify) => {
      this.resolve = (...args) => resolve(...args);
      this.reject = (...args) => reject(...args);
      this.notify = (...args) => notify(...args);
    });
  }

}
