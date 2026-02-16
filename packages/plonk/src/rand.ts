import { clamp } from './clamp';

/** Options for configuring a Rand generator. */
export type RandOptions = {
  /** Lower bound of the range. Defaults to 0. */
  min?: number;
  /** Upper bound of the range. Defaults to 1. */
  max?: number;
};

/** Snapshot of a Rand generator's internal state. */
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

/**
 * Random number generator that produces values within a bounded range.
 * @param opts - {@link RandOptions} for configuring the range.
 */
export class Rand {
  state: RandState;

  /** Returns a single random value. One-off form of `new Rand(opts).value()`. */
  static rand(opts?: RandOptions) {
    return new Rand(opts).value();
  }

  constructor(opts?: RandOptions) {
    const { min, max } = parseOptions(opts);

    this.state = { max, min, value: 0 };
    this.next();
  }

  /** Updates the range bounds, clamping the current value if needed. */
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

  /** Returns the current value. */
  value() {
    return this.state.value;
  }

  /** Generates a new random value within the range. */
  next() {
    const { min, max } = this.state;
    const updates = Math.random() * (max - min) + min;

    this.state.value = updates;

    return updates;
  }
}

/**
 * Random number generator that produces values within a bounded range.
 * One-off form of `new Rand(opts).value()`.
 */
export const rand = Rand.rand;
