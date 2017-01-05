
import asap from 'asap';

import noop from '../util/noop';
import now from '../util/now';
import toNumber from '../util/toNumber';

// Generic high-resolution timer class that forms that basis for all other timers

export default class Timer {

  constructor (time, callback = noop) {
    this.isRunning = false;
    this.time = toNumber(time, 4);
    this.callback = callback;
    this.clear();
  }

  run () {
    if (this.isRunning) return;
    this.isRunning = true;
    this.prev = now();
    this.tick();
  }

  tick () {
    if (!this.isRunning) return;
    asap(() => {
      this.interval = now() - this.prev;
      if (this.interval < this.time) {
        return this.tick();
      }
      this.callback(this.interval, this.index);
      this.prev = now();
      this.index += 1;
      this.tick();
    });
  }

  stop () {
    this.isRunning = false;
    this.clear();
  }

  clear () {
    this.index = 0;
    this.interval = 0;
    this.prev = 0;
  }

}
