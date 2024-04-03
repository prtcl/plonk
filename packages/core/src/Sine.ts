import { clamp, now } from '@prtcl/plonk-utils';
import Scale from './Scale';

export const SINE_PERIOD = Math.PI * 2 - 0.0001;

export type SineOptions = {
  duration: number;
};

export type SineState = {
  cycle: number;
  duration: number;
  prev: number;
  totalElapsed: number;
  value: number;
};

const getInitialState = (duration: number): SineState => ({
  cycle: 0,
  duration,
  prev: now(),
  totalElapsed: 0,
  value: 0,
});

export default class Sine {
  state: SineState;
  protected _interpolator: Scale;

  constructor(opts: SineOptions) {
    const { duration } = opts;

    this._interpolator = new Scale({
      from: {
        min: 0,
        max: duration,
      },
      to: {
        min: 0,
        max: SINE_PERIOD,
      },
    });
    this.state = getInitialState(duration);
  }

  setDuration(duration: number) {
    this.state = {
      ...this.state,
      duration,
    };
  }

  reset(opts?: SineOptions) {
    const { duration } = {
      ...this.state,
      ...opts,
    };

    this.state = getInitialState(duration);
  }

  value() {
    return this.state.value;
  }

  next() {
    const {
      cycle,
      duration,
      prev,
      totalElapsed: prevTotalElapsed,
    } = this.state;
    const curr = now();
    const tickInterval = curr - prev;
    const totalElapsed = prevTotalElapsed + tickInterval;

    const updates = clamp(
      Math.sin(this._interpolator.scale(totalElapsed)),
      -1,
      1,
    );

    if (cycle >= duration) {
      this.state.cycle = 0;
    } else {
      this.state.cycle = cycle + tickInterval;
    }

    this.state.prev = curr;
    this.state.totalElapsed = totalElapsed;
    this.state.value = updates;

    return updates;
  }
}
