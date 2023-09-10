import now from '../utils/now';
import Scale from './Scale';

export type EnvOptions = {
  duration: number;
  from?: number;
  to?: number;
};

export type EnvState = {
  duration: number;
  from: number;
  prev: number;
  to: number;
  totalElapsed: number;
  value: number;
};

export const parseOptions = (opts?: EnvOptions): EnvOptions => {
  return {
    from: 0,
    to: 1,
    ...opts,
  };
};

export const getDerivedStateFromOptions = (
  opts: EnvOptions | undefined,
  prevState: EnvState,
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

export default class Env {
  state: EnvState;
  protected _interpolator: Scale;

  constructor(opts?: EnvOptions) {
    const { from, to, duration } = parseOptions(opts);

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
    this.state = {
      duration,
      from,
      prev: now(),
      to,
      totalElapsed: 0,
      value: from,
    };
  }

  setDuration(duration: number) {
    const { to, totalElapsed } = this.state;

    this.state = {
      ...this.state,
      ...(duration <= totalElapsed
        ? {
            duration,
            prev: to,
          }
        : { duration }),
    };
  }

  reset(opts?: EnvOptions) {
    const updates = getDerivedStateFromOptions(opts, this.state);

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

  hasEnded() {
    return this.state.duration <= this.state.totalElapsed;
  }

  value() {
    return this.state.value;
  }

  next() {
    const { from, prev, to, totalElapsed: prevTotalElapsed } = this.state;

    if (this.hasEnded()) {
      return to;
    }

    const curr = now();
    const tickInterval = curr - prev;
    const totalElapsed = prevTotalElapsed + tickInterval;
    const updates = this._interpolator.scale(totalElapsed);
    const value = from > to ? Math.min(updates, from) : Math.min(updates, to);

    this.state.prev = curr;
    this.state.totalElapsed = totalElapsed;
    this.state.value = value;

    return value;
  }
}
