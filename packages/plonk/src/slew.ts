import { clamp } from './clamp';
import { now } from './now';
import { Scale } from './scale';

/** Options for configuring a Slew processor. */
export type SlewOptions = {
  /** Duration of each transition in milliseconds. Defaults to 1000. */
  duration?: number;
  /** Initial value. Defaults to 0. */
  value?: number;
};

/** Snapshot of a Slew processor's internal state. */
export type SlewState = {
  duration: number;
  from: number;
  prev: number;
  to: number;
  totalElapsed: number;
  value: number;
};

export const parseOptions = (opts?: SlewOptions): Required<SlewOptions> => {
  return {
    duration: 1000,
    value: 0,
    ...opts,
  };
};

const getInitialState = (duration: number, value: number): SlewState => {
  return {
    duration,
    from: value,
    prev: now(),
    to: value,
    totalElapsed: 0,
    value,
  };
};

/**
 * Continuous interpolation processor which transitions toward a target value over a fixed duration.
 * @param opts - {@link SlewOptions} for configuring duration and initial value.
 */
export class Slew {
  state: SlewState;
  protected _interpolator: Scale;

  /** Creates a new Slew instance. Alternative form of `new Slew(opts)`. */
  static slew(opts?: SlewOptions) {
    return new Slew(opts);
  }

  constructor(opts?: SlewOptions) {
    const { duration, value } = parseOptions(opts);

    this.state = getInitialState(duration, value);
    this._interpolator = new Scale({
      from: {
        min: 0,
        max: duration,
      },
      to: {
        min: value,
        max: value,
      },
    });
  }

  /** Returns true when the current value has reached the target. */
  done() {
    return this.state.from === this.state.to || this.state.duration <= this.state.totalElapsed;
  }

  /** Returns the current value. */
  value() {
    if (this.done()) {
      return this.state.to;
    }

    return this.state.value;
  }

  /** Sets a new target value, beginning a transition from the current position. */
  setValue(to: number) {
    const from = this.value();

    this.state = {
      ...this.state,
      from,
      to,
      prev: now(),
      totalElapsed: 0,
    };
    this._interpolator.setRanges({
      to: { min: from, max: to },
    });
  }

  /** Updates the transition duration in milliseconds. */
  setDuration(duration: number) {
    this.state.duration = Math.max(duration, 0);
    this._interpolator.setRanges({
      from: { min: 0, max: this.state.duration },
    });
  }

  /** Advances the processor and returns the current value. */
  next() {
    if (this.done()) {
      return this.value();
    }

    const { prev, totalElapsed: prevTotalElapsed, duration } = this.state;

    const curr = now();
    const totalElapsed = prevTotalElapsed + (curr - prev);
    const value = this._interpolator.scale(clamp(totalElapsed, 0, duration));

    this.state.prev = curr;
    this.state.totalElapsed = totalElapsed;
    this.state.value = value;

    return value;
  }
}

/**
 * Continuous interpolation processor which transitions toward a target value over a fixed duration.
 * Alternative form of `new Slew(opts)`.
 */
export const slew = Slew.slew;
