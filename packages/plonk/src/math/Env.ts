import { now } from '../utils/now';
import { Scale } from './Scale';

export type EnvState = {
  duration: number;
  from: number;
  prev: number;
  to: number;
  totalElapsed: number;
  value: number;
};

export type EnvOptions = {
  duration: number;
  from?: number;
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

const getInitialState = ({
  from,
  to,
  duration,
}: Required<EnvOptions>): EnvState => {
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

export class Env {
  state: EnvState;
  protected _interpolator: Scale;

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
