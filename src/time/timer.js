
import noop from '../util/noop';
import now from '../util/now';
import toNumber from '../util/toNumber';

// Generic high-resolution timer class that forms the basis for all other timers

export default class Timer {

  constructor (time, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('Timer callback needs to be a function');
    }

    this._tickHandler = tickHandler;
    this._timeOffset = 0;
    this._callback = callback;
    this._prev = 0;

    this.isRunning = false;
    this.time = this._initialTime = toNumber(time, 1000 / 60);
    this.interval = 0;

    this.reset();
  }

  _callTickHandler () {
    if (!this.isRunning) {
      return;
    }

    this._tickHandler(() => {

      // first tick
      if (this.iterations === 0) {
        this._callback && this._callback(0, 0, 0);
        this._prev = now();

        this.iterations = 1;

        return this._callTickHandler();
      }

      this.interval = now() - this._prev;

      // interval is below target interval
      if (this.interval <= this.time + this._timeOffset) {
        return this._callTickHandler();
      }

      this.elapsed += this.interval;
      this._callback && this._callback(this.interval, this.iterations, this.elapsed);

      if (this.isRunning) {
        this._prev = now();
        this.iterations += 1;
        this._callTickHandler();
      }

    });
  }

  run () {
    if (this.isRunning) {
      return this;
    }

    this._prev = now();
    this.isRunning = true;
    this._callTickHandler();

    return this;
  }

  stop () {
    const elapsed = this.elapsed;

    this.isRunning = false;
    this.reset();

    return elapsed;
  }

  reset () {

    this._prev = 0;
    this.elapsed = 0;
    this.iterations = 0;
    this.interval = 0;

    this.time = this._initialTime;

    return this;
  }

}

function tickHandler (callback = noop) {
  setTimeout(callback, 0);
}
