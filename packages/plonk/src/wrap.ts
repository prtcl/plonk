/** Options for configuring a Wrap transformer. */
export type WrapOptions = {
  /** Lower bound of the range. Defaults to 0. */
  min?: number;
  /** Upper bound of the range. Defaults to 1. */
  max?: number;
};

/** Snapshot of a Wrap transformer's internal state. */
export type WrapState = {
  min: number;
  max: number;
  value: number;
};

export const parseOptions = (opts?: WrapOptions): Required<WrapOptions> => {
  return {
    min: 0,
    max: 1,
    ...opts,
  };
};

/**
 * Wraps values around a configured range using modular arithmetic.
 * @param opts - {@link WrapOptions} for configuring the range.
 */
export class Wrap {
  state: WrapState;

  /** Creates a new Wrap instance. Alternative form of `new Wrap(opts)`. */
  static wrap(opts?: WrapOptions) {
    return new Wrap(opts);
  }

  constructor(opts?: WrapOptions) {
    const { min, max } = parseOptions(opts);

    this.state = { min, max, value: min };
  }

  /** Updates the range bounds, wrapping the current value into the new range. */
  setRange(partialOpts: WrapOptions) {
    const { min, max } = {
      ...this.state,
      ...partialOpts,
    };

    this.state = {
      ...this.state,
      min,
      max,
      value: transform(this.state.value, min, max),
    };
  }

  /** Returns the last wrapped value. */
  value() {
    return this.state.value;
  }

  /** Wraps a value into the configured range and caches the result. */
  wrap(n: number) {
    const { min, max } = this.state;
    const updates = transform(n, min, max);

    this.state.value = updates;

    return updates;
  }
}

/**
 * Wraps values around a configured range using modular arithmetic.
 * Alternative form of `new Wrap(opts)`.
 */
export const wrap = Wrap.wrap;

/**
 * Wraps a value around a range using modular arithmetic.
 * @param n - The input value.
 * @param min - Lower bound (defaults to 0).
 * @param max - Upper bound (defaults to 1).
 * @returns The wrapped value within the range.
 */
export function transform(n: number, min?: number, max?: number) {
  let a = 0;
  let b = 1;

  if (typeof min === 'number') {
    if (typeof max === 'number') {
      a = min;
      b = max;
    } else {
      a = 0;
      b = min;
    }
  }

  const lo = Math.min(a, b);
  const range = Math.max(a, b) - lo;

  if (range === 0) return lo;

  const offset = n - lo;

  return lo + (((offset % range) + range) % range);
}
