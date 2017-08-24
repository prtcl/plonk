
import now from './now';
import toNumber from './toNumber';

const SIXTY_FPS = 1000 / 60;

// Generic high-resolution timer class that forms the basis for all other timers

export default class Timer {

  constructor (time, callback) {
    if (arguments.length >= 2) {
      time = Math.max(toNumber(time, SIXTY_FPS), 0);
    } else if (arguments.length === 1) {
      callback = time;
      time = SIXTY_FPS;
    }

    if (typeof callback !== 'function') {
      throw new TypeError('Timer callback must be a function');
    }

    this._asyncHandler = asyncHandler;
    this._callback = callback;

    this._state = {
      elapsed: 0,
      initialTime: time,
      interval: 0,
      isRunning: false,
      iterations: 0,
      offset: 0,
      prev: 0,
      time
    };

  }

  run () {
    if (this._state.isRunning) {
      return this;
    }

    this._state.prev = now();
    this._state.isRunning = true;

    const tick = () => {
      const isRunning = tickHandler(this._state, this._callback);
      if (isRunning) {
        this._asyncHandler(tick);
      }
    };

    this._asyncHandler(tick);

    return this;
  }

  stop () {
    const elapsed = this._state.elapsed;

    this._state.isRunning = false;
    this.reset();

    return elapsed;
  }

  reset () {

    this._state.elapsed = 0;
    this._state.interval = 0;
    this._state.iterations = 0;
    this._state.prev = 0;
    this._state.time = this._state.initialTime;

    return this;
  }

  setTime (time = this._state.time) {
    this._state.time = this._state.initialTime = Math.max(toNumber(time, this._state.time), 0);

    return this;
  }

}

export function asyncHandler (callback) {
  setTimeout(callback, 0);
}

export function tickHandler (state, callback) {
  if (!state.isRunning) {
    return state.isRunning;
  }

  // first tick
  if (state.iterations === 0) {
    callback(0, 0, 0);

    state.prev = now();
    state.iterations = 1;

    return state.isRunning;
  }

  state.interval = now() - state.prev;

  // interval is below target interval
  if (state.interval <= state.time + state.offset) {
    return state.isRunning;
  }

  state.elapsed += state.interval;

  callback(state.interval, state.iterations, state.elapsed);

  if (state.isRunning) {
    state.prev = now();
    state.iterations += 1;
  }

  return state.isRunning;

}
