import { SIXTY_FPS } from './constants';
import { now } from './now';

/** Snapshot of a running timer's internal state. */
export type TimerState = {
  initialTime: number;
  isRunning: boolean;
  iterations: number;
  prev: number;
  tickInterval: number;
  time: number;
  totalElapsed: number;
};

export const getInitialState = (initialTime: number): TimerState => {
  return {
    initialTime,
    isRunning: false,
    iterations: -1,
    prev: 0,
    tickInterval: 0,
    time: initialTime,
    totalElapsed: 0,
  };
};

export const processTimerState = (state: TimerState): TimerState | null => {
  const { time, prev, totalElapsed, iterations } = state;
  const curr = now();

  if (iterations === -1) {
    return {
      ...state,
      prev: curr,
      iterations: 0,
    };
  }

  const tickInterval = curr - prev;

  if (tickInterval <= time) {
    return null;
  }

  return {
    ...state,
    iterations: iterations + 1,
    prev: curr,
    tickInterval,
    totalElapsed: totalElapsed + tickInterval,
  };
};

/** Options for configuring a Metro timer. */
export type MetroOptions = {
  /** Interval between ticks in milliseconds. Defaults to ~16.67ms (60fps). */
  time?: number;
};

export const parseOptions = (opts?: MetroOptions): Required<MetroOptions> => {
  return {
    time: SIXTY_FPS,
    ...opts,
  };
};

/** Callback invoked on each timer tick with the timer instance. */
export type TimerCallback<T extends Metro> = (timer: T) => void;

/**
 * High-resolution recursive timer with variable interval, provides runtime metrics via callback for time-based calculations.
 * @param callback - {@link TimerCallback} called on each tick with the timer instance.
 * @param opts - {@link MetroOptions} for configuring the timer interval.
 */
export class Metro {
  state: TimerState;
  protected _listeners: TimerCallback<Metro>[];
  declare protected _timerId: ReturnType<typeof setTimeout> | number;

  constructor(callback: TimerCallback<Metro>, opts?: MetroOptions) {
    const { time } = parseOptions(opts);
    this.state = getInitialState(time);
    this._listeners = [callback];
  }

  protected asyncHandler(callback: () => void) {
    this._timerId = setTimeout(callback, SIXTY_FPS);
  }

  protected clearAsyncHandler() {
    clearTimeout(this._timerId);
  }

  stop = () => {
    const { totalElapsed } = this.state;
    this.reset();
    this.clearAsyncHandler();

    return totalElapsed;
  };

  reset = () => {
    const { initialTime } = this.state;
    this.state = getInitialState(initialTime);
  };

  setTime = (updatedTime = this.state.time) => {
    const time = Math.max(updatedTime, 0);

    this.state = {
      ...this.state,
      time,
      initialTime: time,
    };
  };

  run = () => {
    if (this.state.isRunning) {
      this.stop();
    }

    this.state = {
      ...this.state,
      isRunning: true,
      prev: now(),
    };

    const tick = () => {
      const updates = processTimerState(this.state);

      if (updates) {
        this.state = updates;
        this._listeners.forEach((listener) => {
          listener(this);
        });
      }

      if (this.state.isRunning) {
        this.asyncHandler(tick);
      }
    };

    tick();
  };
}
