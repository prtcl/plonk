import { clamp } from '../utils';

export type RandOptions = {
  min?: number;
  max?: number;
};

export type RandState = {
  min: number;
  max: number;
  value: number | undefined;
};

export const parseOptions = (opts?: RandOptions): RandOptions => {
  return {
    min: 0,
    max: 1,
    ...opts,
  };
};

export default class Rand {
  state: RandState;

  static rand(opts?: RandOptions) {
    return new Rand(opts).value();
  }

  constructor(opts?: RandOptions) {
    const { min, max } = parseOptions(opts);

    this.state = { max, min, value: undefined };
    this.next();
  }

  setRange(partialOpts: RandOptions) {
    const { min, max } = {
      ...this.state,
      ...partialOpts,
    };

    this.state = {
      ...this.state,
      max,
      min,
      value: clamp(this.state.value, min, max),
    };
  }

  value() {
    return this.state.value;
  }

  next() {
    const { min, max } = this.state;
    const updates = Math.random() * (max - min) + min;

    this.state.value = updates;

    return updates;
  }
}
