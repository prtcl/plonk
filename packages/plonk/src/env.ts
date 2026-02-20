import { clamp } from './clamp';
import { now } from './now';
import { Scale } from './scale';

/** Snapshot of an Env's internal state. */
export type EnvState = {
  curve: number;
  duration: number;
  from: number;
  isRunning: boolean;
  prev: number;
  to: number;
  totalElapsed: number;
  value: number;
};

/** Options for configuring an Env envelope. */
export type EnvOptions = {
  /** Curvature of the envelope. 1 is linear, >1 ease-in, <1 ease-out. Defaults to 1. */
  curve?: number;
  /** Duration of the envelope in milliseconds. */
  duration: number;
  /** Starting value. Defaults to 0. */
  from?: number;
  /** Ending value. Defaults to 1. */
  to?: number;
};

export const parseOptions = (opts?: EnvOptions): Required<EnvOptions> => {
  return {
    curve: 1,
    duration: 0,
    from: 0,
    to: 1,
    ...opts,
  };
};

const getInitialState = ({ curve, from, to, duration }: Required<EnvOptions>): EnvState => {
  return {
    curve,
    duration,
    from,
    isRunning: false,
    prev: now(),
    to,
    totalElapsed: 0,
    value: from,
  };
};

export const updateStateFromOptions = (
  opts: EnvOptions | undefined,
  prevState: EnvState
): EnvState => {
  const { curve, from, to, duration } = {
    ...prevState,
    ...opts,
  };

  return {
    ...prevState,
    curve,
    duration,
    from,
    to,
    totalElapsed: 0,
  };
};

/**
 * Envelope which interpolates between two values over a duration, with optional curvature.
 * @param opts - {@link EnvOptions} for configuring the envelope.
 */
export class Env {
  state: EnvState;
  protected _interpolator: Scale;

  /** Creates a new Env instance. Alternative form of `new Env(opts)`. */
  static env(opts: EnvOptions) {
    return new Env(opts);
  }

  constructor(opts: EnvOptions) {
    const { curve, from, to, duration } = parseOptions(opts);

    this.state = getInitialState({ curve, from, to, duration });
    this._interpolator = new Scale({
      to: {
        min: from,
        max: to,
      },
    });
  }

  /** Triggers or re-triggers the envelope from the beginning. */
  start() {
    this.state.isRunning = true;
    this.state.prev = now();
    this.state.totalElapsed = 0;
    this.state.value = this.state.from;
  }

  /** Updates the output range. */
  setFromTo(from: number, to: number) {
    this.state.from = from;
    this.state.to = to;
    this._interpolator.setRanges({
      to: { min: from, max: to },
    });
  }

  /** Updates the envelope duration. */
  setDuration(duration: number) {
    const { to, totalElapsed } = this.state;

    this.state = {
      ...this.state,
      ...(duration <= totalElapsed
        ? {
            duration,
            value: to,
          }
        : { duration }),
    };
  }

  /** Resets the envelope with optional new options, without triggering. */
  reset(opts?: EnvOptions) {
    const updates = updateStateFromOptions(opts, this.state);

    this.state = {
      ...updates,
      isRunning: false,
      prev: now(),
      value: updates.from,
    };
    this._interpolator.setRanges({
      to: {
        min: updates.from,
        max: updates.to,
      },
    });
  }

  /** Returns true when the envelope has completed. */
  done() {
    return this.state.duration <= this.state.totalElapsed;
  }

  /** Returns the current interpolated value. */
  value() {
    const { to, value } = this.state;

    if (this.done()) {
      return to;
    }

    return value;
  }

  /** Advances the envelope and returns the new value. */
  next() {
    if (!this.state.isRunning) return this.value();
    if (this.done()) {
      this.state.isRunning = false;
      return this.value();
    }

    const { curve, duration, prev, totalElapsed: prevTotalElapsed } = this.state;

    const curr = now();
    const tickInterval = curr - prev;
    const totalElapsed = prevTotalElapsed + tickInterval;

    const progress = clamp(totalElapsed / duration, 0, 1);
    const shaped = Math.pow(progress, curve);
    const updates = this._interpolator.scale(shaped);

    this.state.prev = curr;
    this.state.totalElapsed = totalElapsed;
    this.state.value = updates;

    if (this.done()) {
      this.state.isRunning = false;
    }

    return updates;
  }
}

/**
 * Envelope which interpolates between two values over a duration, with optional curvature.
 * Alternative form of `new Env(opts)`.
 */
export const env = Env.env;
