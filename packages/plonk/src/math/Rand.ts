import { clamp } from '../utils/clamp';

export type RandOptions = {
  min?: number;
  max?: number;
};

export type RandState = {
  min: number;
  max: number;
  value: number;
};

export const parseOptions = (opts?: RandOptions): Required<RandOptions> => {
  return {
    min: 0,
    max: 1,
    ...opts,
  };
};

export class Rand {
  state: RandState;

  static rand(opts?: RandOptions) {
    return new Rand(opts).value();
  }

  constructor(opts?: RandOptions) {
    const { min, max } = parseOptions(opts);

    this.state = { max, min, value: 0 };
    this.next();
  }

  setRange(partialOpts: RandOptions) {
    const { value = 0 } = this.state;
    const { min, max } = {
      ...this.state,
      ...partialOpts,
    };

    this.state = {
      ...this.state,
      max,
      min,
      value: clamp(value, min, max),
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
