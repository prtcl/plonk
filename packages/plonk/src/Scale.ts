import { clamp } from './clamp';

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
  /** Input range. */
  from: Required<ScaleRange>;
  /** Precomputed (to.max - to.min) / (from.max - from.min), updated when ranges change. */
  ratio: number;
  /** Output range. */
  to: Required<ScaleRange>;
  /** Last scaled value. */
  value: number;
};

/** Precompute the scale factor so the hot path avoids a division per call. */
const computeRatio = (from: Required<ScaleRange>, to: Required<ScaleRange>) =>
  (to.max - to.min) / (from.max - from.min);

/** Build initial state from options, applying defaults and computing the ratio. */
export const parseInitialState = (opts?: ScaleOptions): ScaleState => {
  const initialRange: Pick<ScaleState, 'from' | 'to'> = {
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
    ...initialRange,
    ratio: computeRatio(initialRange.from, initialRange.to),
    value: initialRange.to.min,
  };
};

/** Merge partial range updates into existing state, recomputing the ratio. */
export const updateStateFromOptions = (opts: ScaleOptions, prevState: ScaleState): ScaleState => {
  const { from, to } = opts;
  const updatedFrom: Required<ScaleRange> = {
    ...prevState.from,
    ...from,
  };
  const updatedTo: Required<ScaleRange> = {
    ...prevState.to,
    ...to,
  };

  return {
    ...prevState,
    from: updatedFrom,
    ratio: computeRatio(updatedFrom, updatedTo),
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
    this.state = parseInitialState(opts);
  }

  setRanges(opts: ScaleOptions) {
    this.state = updateStateFromOptions(opts, this.state);
  }

  reset(opts: ScaleOptions) {
    this.state = parseInitialState(opts);
  }

  value() {
    return this.state.value;
  }

  scale(n: number) {
    const { from, to, ratio } = this.state;
    const updates = to.min + (clamp(n, from.min, from.max) - from.min) * ratio;

    this.state.value = updates;

    return updates;
  }
}
