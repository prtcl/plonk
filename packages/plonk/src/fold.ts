import { clamp } from './clamp';

/** Options for configuring a Fold transformer. */
export type FoldOptions = {
  /** Lower bound of the range. Defaults to 0. */
  min?: number;
  /** Upper bound of the range. Defaults to 1. */
  max?: number;
};

/** Snapshot of a Fold transformer's internal state. */
export type FoldState = {
  min: number;
  max: number;
  value: number;
};

export const parseOptions = (opts?: FoldOptions): Required<FoldOptions> => {
  return {
    min: 0,
    max: 1,
    ...opts,
  };
};

/**
 * Folds (reflects) values back and forth within a configured range.
 * @param opts - {@link FoldOptions} for configuring the range.
 */
export class Fold {
  state: FoldState;

  static fold(n: number, opts?: FoldOptions) {
    return new Fold(opts).fold(n);
  }

  constructor(opts?: FoldOptions) {
    const { min, max } = parseOptions(opts);
    this.state = { min, max, value: min };
  }

  setRange(partialOpts: FoldOptions) {
    const { min, max } = { ...this.state, ...partialOpts };

    this.state = {
      ...this.state,
      min,
      max,
      value: transform(this.state.value, min, max),
    };
  }

  value() {
    return this.state.value;
  }

  fold(n: number) {
    const { min, max } = this.state;
    const updates = transform(n, min, max);

    this.state.value = updates;

    return updates;
  }
}

/** Export lowercase function for one-off stateless use cases */
export const fold = Fold.fold;

/**
 * Folds (reflects) a value back and forth within a range.
 * @param n - The input value.
 * @param min - Lower bound (defaults to 0).
 * @param max - Upper bound (defaults to 1).
 * @returns The folded value within [min, max].
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
  const hi = Math.max(a, b);
  const range = hi - lo;

  if (range === 0) return lo;

  const period = range * 2;
  const offset = n - lo;

  // Normalize into one full bounce cycle [0, period)
  const normalized = ((offset % period) + period) % period;

  // First half travels forward, second half reflects back
  const value = normalized <= range ? lo + normalized : lo + period - normalized;

  return clamp(value, lo, hi);
}
