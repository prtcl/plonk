
import now from './now';
import toNumber from './toNumber';

const SIXTY_FPS = 1000 / 60;

// Generic high-resolution timer class that forms the basis for all other timers

export default class Timer {

  constructor (time, callback) {
    if (arguments.length >= 2) {
      time = Math.max(toNumber(time, SIXTY_FPS), 0);
    } else if (arguments.length === 1) {
      callback = time || callback;
      time = SIXTY_FPS;
    }

    if (typeof callback !== 'function') {
      throw new TypeError('Timer callback needs to be a function');
    }

    this._asyncHandler = asyncHandler;
    this._timeOffset = 0;
    this._callback = callback;
    this._prev = 0;

    this.isRunning = false;
    this.time = this._initialTime = time;
    this.interval = 0;

    this.reset();
  }

  run () {
    if (this.isRunning) {
      return this;
    }

    this._prev = now();
    this.isRunning = true;

    const tick = () => {
      const isRunning = tickHandler(this);
      if (isRunning) {
        this._asyncHandler(tick);
      }
    };

    this._asyncHandler(tick);

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

  setTime (time = this.time) {
    this.time = this._initialTime = Math.max(toNumber(time, this.time), 0);

    return this;
  }

}

export function asyncHandler (callback) {
  setTimeout(callback, 0);
}

export function tickHandler (timer) {
  if (!timer.isRunning) {
    return timer.isRunning;
  }

  // first tick
  if (timer.iterations === 0) {
    timer._callback && timer._callback(0, 0, 0);
    timer._prev = now();

    timer.iterations = 1;

    return timer.isRunning;
  }

  timer.interval = now() - timer._prev;

  // interval is below target interval
  if (timer.interval <= timer.time + timer._timeOffset) {
    return timer.isRunning;
  }

  timer.elapsed += timer.interval;
  timer._callback && timer._callback(timer.interval, timer.iterations, timer.elapsed);

  if (timer.isRunning) {
    timer._prev = now();
    timer.iterations += 1;
  }

  return timer.isRunning;

}
