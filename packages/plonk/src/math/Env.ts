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
  prevNow: number;
  prevValue: number;
  to: number;
  totalElapsed: number;
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
      prevNow: now(),
      prevValue: from,
      to,
      totalElapsed: 0,
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
      prevNow: now(),
      prevValue: updates.from,
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
    return this.state.prevValue;
  }

  next() {
    const { from, prevNow, to, totalElapsed: prevTotalElapsed } = this.state;

    if (this.hasEnded()) {
      return to;
    }

    const tickInterval = now() - prevNow;
    const totalElapsed = prevTotalElapsed + tickInterval;
    const updates = this._interpolator.scale(totalElapsed);
    const value = from > to ? Math.min(updates, from) : Math.min(updates, to);

    this.state = {
      ...this.state,
      prevNow: now(),
      prevValue: value,
      totalElapsed,
    };

    return value;
  }
}
