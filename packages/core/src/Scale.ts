import { clamp } from '@prtcl/plonk-utils';

export type ScaleRange = {
  min?: number;
  max: number;
};

export type ScaleOptions = {
  from?: ScaleRange;
  to?: ScaleRange;
};

export type ScaleState = {
  from: ScaleRange;
  to: ScaleRange;
  value: number | undefined;
};

export const parseOptions = (opts?: ScaleOptions): ScaleOptions => {
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

export default class Scale {
  state: ScaleState;

  static scale(n: number, opts?: ScaleOptions) {
    return new Scale(opts).scale(n);
  }

  constructor(opts?: ScaleOptions) {
    const { from, to } = parseOptions(opts);
    this.state = { from, to, value: undefined };
  }

  setRanges(opts: ScaleOptions) {
    this.state = updateStateFromOptions(opts, this.state);
  }

  reset(opts: ScaleOptions) {
    const { from, to } = parseOptions(opts);
    this.state = { from, to, value: undefined };
  }

  value() {
    return this.state.value;
  }

  scale(n: number) {
    const { from, to } = this.state;
    const value =
      to.min +
      ((clamp(n, from.min, from.max) - from.min) * (to.max - to.min)) /
        (from.max - from.min);

    this.state.value = value;

    return value;
  }
}
