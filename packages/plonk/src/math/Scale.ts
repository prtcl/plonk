import { clamp } from '../utils/clamp';

/** A numeric range with min and max bounds. */
export type ScaleRange = {
  min?: number;
  max: number;
};

/** Options for configuring a Scale mapper. */
export type ScaleOptions = {
  /** Input range. Defaults to { min: 0, max: 1 }. */
  from?: ScaleRange;
  /** Output range. Defaults to { min: 0, max: 1 }. */
  to?: ScaleRange;
};

/** Snapshot of a Scale mapper's internal state. */
export type ScaleState = {
  from: Required<ScaleRange>;
  to: Required<ScaleRange>;
  value: number;
};

export const parseOptions = (
  opts?: ScaleOptions,
): { from: Required<ScaleRange>; to: Required<ScaleRange> } => {
  const { from, to } = {
    ...opts,
    from: {
      min: 0,
      max: 1,
      ...opts?.from,
    },
    to: {
      min: 0,
      max: 1,
      ...opts?.to,
    },
  };

  return {
    from,
    to,
  };
};

export const updateStateFromOptions = (
  opts: ScaleOptions,
  prevState: ScaleState,
): ScaleState => {
  const { from, to } = opts;

  const updatedTo = {
    ...prevState.to,
    ...to,
  };

  return {
    ...prevState,
    from: {
      ...prevState.from,
      ...from,
    },
    to: updatedTo,
    value: clamp(prevState.value, updatedTo.min, updatedTo.max),
  };
};

/**
 * Linear map of values from one range to another, supports negative values and inversion.
 * @param opts - {@link ScaleOptions} for configuring input and output ranges.
 */
export class Scale {
  state: ScaleState;

  static scale(n: number, opts?: ScaleOptions) {
    return new Scale(opts).scale(n);
  }

  constructor(opts?: ScaleOptions) {
    const { from, to } = parseOptions(opts);
    this.state = { from, to, value: to.min };
  }

  setRanges(opts: ScaleOptions) {
    this.state = updateStateFromOptions(opts, this.state);
  }

  reset(opts: ScaleOptions) {
    const { from, to } = parseOptions(opts);
    this.state = { from, to, value: to.min };
  }

  value() {
    return this.state.value;
  }

  scale(n: number) {
    const { from, to } = this.state;
    const updates =
      to.min +
      ((clamp(n, from.min, from.max) - from.min) * (to.max - to.min)) /
        (from.max - from.min);

    this.state.value = updates;

    return updates;
  }
}
