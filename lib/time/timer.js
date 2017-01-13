
import asap from 'asap';

import noop from '../util/noop';
import now from '../util/now';
import toNumber from '../util/toNumber';

// Generic high-resolution timer class that forms that basis for all other timers

export default class Timer {

  constructor (time, callback = noop) {
    this._tickHandler = asap;
    this.isRunning = false;
    this.time = toNumber(time, 1000 / 60);
    this.initialTime = this.time;
    this.callback = callback;
    this.reset();
  }

  run () {
    if (this.isRunning) return;
    this.isRunning = true;
    this.prev = now();
    this.tick();
    return this;
  }

  tick () {
    if (!this.isRunning) return;
    this._tickHandler(() => {
      if (this.iterations === 0) {
        this.callback(0, 0, 0);
        this.prev = now();
        this.iterations = 1;
        return this.tick();
      }
      this.interval = now() - this.prev;
      if (this.interval < this.time) {
        return this.tick();
      }
      this.elapsed += this.interval;
      this.callback(this.interval, this.iterations, this.elapsed);
      if (this.isRunning) {
        this.prev = now();
        this.iterations += 1;
        this.tick();
      }
    });
  }

  stop () {
    var elapsed = this.elapsed;
    this.isRunning = false;
    this.reset();
    return elapsed;
  }

  reset () {
    this.elapsed = 0;
    this.iterations = 0;
    this.interval = 0;
    this.prev = 0;
    this.time = this.initialTime;
    return this;
  }

}
