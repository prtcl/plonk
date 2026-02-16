import { now } from './now';
import { Scale } from './scale';

/** Snapshot of an Env's internal state. */
export type EnvState = {
  duration: number;
  from: number;
  prev: number;
  to: number;
  totalElapsed: number;
  value: number;
};

/** Options for configuring an Env envelope. */
export type EnvOptions = {
  /** Duration of the envelope in milliseconds. */
  duration: number;
  /** Starting value. Defaults to 0. */
  from?: number;
  /** Ending value. Defaults to 1. */
  to?: number;
};

export const parseOptions = (opts?: EnvOptions): Required<EnvOptions> => {
  return {
    duration: 0,
    from: 0,
    to: 1,
    ...opts,
  };
};

const getInitialState = ({ from, to, duration }: Required<EnvOptions>): EnvState => {
  return {
    duration,
    from,
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
  const { from, to, duration } = {
    ...prevState,
    ...opts,
  };

  return {
    ...prevState,
    duration,
    from,
    to,
    totalElapsed: 0,
  };
};

/**
 * Linear envelope which interpolates between two values over a duration. Useful for audio envelopes, transitions, and animations.
 * @param opts - {@link EnvOptions} for configuring the envelope.
 */
export class Env {
  state: EnvState;
  protected _interpolator: Scale;

  static env(opts: EnvOptions) {
    return new Env(opts);
  }

  constructor(opts: EnvOptions) {
    const { from, to, duration } = parseOptions(opts);

    this.state = getInitialState({ from, to, duration });
    this._interpolator = new Scale({
      from: {
        min: 0,
        max: duration,
      },
      to: {
        min: from,
        max: to,
      },
    });
  }

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

  reset(opts?: EnvOptions) {
    const updates = updateStateFromOptions(opts, this.state);

    this.state = {
      ...updates,
      prev: now(),
      value: updates.from,
    };
    this._interpolator.setRanges({
      from: {
        min: 0,
        max: updates.duration,
      },
      to: {
        min: updates.from,
        max: updates.to,
      },
    });
  }

  done() {
    return this.state.duration <= this.state.totalElapsed;
  }

  value() {
    const { to, value } = this.state;

    if (this.done()) {
      return to;
    }

    return value;
  }

  next() {
    if (this.done()) {
      return this.value();
    }

    const { prev, totalElapsed: prevTotalElapsed } = this.state;

    const curr = now();
    const tickInterval = curr - prev;
    const totalElapsed = prevTotalElapsed + tickInterval;
    const updates = this._interpolator.scale(totalElapsed);

    this.state.prev = curr;
    this.state.totalElapsed = totalElapsed;
    this.state.value = updates;

    return updates;
  }
}

/**
 * Linear envelope which interpolates between two values over a duration. Useful for audio envelopes, transitions, and animations.
 * Alternative form of `new Env(opts)`.
 */
export const env = Env.env;
