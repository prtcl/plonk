import now from '../utils/now';
import { SIXTY_FPS } from '../constants';

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
  if (state.iterations === -1) {
    return {
      ...state,
      prev: now(),
      iterations: 0,
    };
  }

  const { time, prev, totalElapsed, iterations } = state;
  const tickInterval = now() - prev;

  if (tickInterval <= time) {
    return null;
  }

  return {
    ...state,
    iterations: iterations + 1,
    prev: now(),
    tickInterval,
    totalElapsed: totalElapsed + tickInterval,
  };
};

export type MetroOptions = {
  time?: number;
};

export const parseOptions = (opts?: MetroOptions): MetroOptions => {
  return {
    time: SIXTY_FPS,
    ...opts,
  };
};

export type TimerCallback<TimerApi extends Metro> = (timer: TimerApi) => void;

export default class Metro {
  state: TimerState;
  protected _listeners: TimerCallback<Metro>[];
  protected _timerId: ReturnType<typeof setTimeout> | number;

  constructor(callback: TimerCallback<Metro>, opts?: MetroOptions) {
    const { time } = parseOptions(opts);
    this.state = getInitialState(time);
    this._listeners = [callback];
  }

  asyncHandler(callback: () => void) {
    this._timerId = setTimeout(callback, SIXTY_FPS);
  }

  clearAsyncHandler() {
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
