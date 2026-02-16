import { clamp } from './clamp';
import { Rand } from './rand';

export const DEFAULT_DRUNK_STEP = 0.1;

/** Options for configuring a Drunk random walk. */
export type DrunkOptions = {
  /** Upper bound of the range. Defaults to 1. */
  max?: number;
  /** Lower bound of the range. Defaults to 0. */
  min?: number;
  /** Initial value. If omitted, a random value within the range is used. */
  startsAt?: number;
  /** Maximum step size as a fraction of the range (0-1). Defaults to 0.1. */
  step?: number;
};

/** Snapshot of a Drunk walk's internal state. */
export type DrunkState = {
  initialValue: number;
  max: number;
  min: number;
  step: number;
  value: number;
};

export const parseStepSize = (step?: number): number =>
  typeof step !== 'undefined' ? clamp(step, 0, 1) : DEFAULT_DRUNK_STEP;

export const parseOptions = (opts?: DrunkOptions): Required<DrunkOptions> => {
  const { step, ...restOpts } = opts || {};
  const parsedStepSize = parseStepSize(step);

  return {
    max: 1,
    min: 0,
    startsAt: 0,
    step: parsedStepSize,
    ...restOpts,
  };
};

/**
 * Stochastic random walk generator that produces values within a bounded range.
 * @param opts - {@link DrunkOptions} for configuring the walk.
 */
export class Drunk {
  state: DrunkState;
  protected _initialValue: Rand;
  protected _step: Rand;

  /** Creates a new Drunk instance. Alternative form of `new Drunk(opts)`. */
  static drunk(opts?: DrunkOptions) {
    return new Drunk(opts);
  }

  constructor(opts?: DrunkOptions) {
    const { min, max, step, startsAt } = parseOptions(opts);

    this._initialValue = new Rand({ min, max });
    this._step = new Rand({ min: -1, max: 1 });

    const initialValue =
      typeof opts?.startsAt !== 'undefined' ? startsAt : this._initialValue.value();

    this.state = {
      initialValue,
      max,
      min,
      step,
      value: initialValue,
    };
  }

  /** Updates the walk bounds, clamping the current value if needed. */
  setRange(partialOpts?: Pick<DrunkOptions, 'min' | 'max'>) {
    const { max, min } = {
      min: this.state.min,
      max: this.state.max,
      ...partialOpts,
    };

    this._initialValue.setRange({ min, max });
    this.state = {
      ...this.state,
      ...(min !== this.state.min || max !== this.state.max
        ? {
            initialValue: clamp(this._initialValue.value(), min, max),
            max,
            min,
            value: clamp(this.state.value, min, max),
          }
        : {
            max,
            min,
          }),
    };
  }

  /** Updates the maximum step size. */
  setStepSize(partialOpts?: Pick<DrunkOptions, 'step'>) {
    const step = parseStepSize(partialOpts?.step);

    this.state = {
      ...this.state,
      step,
    };
  }

  /** Resets the walk with optional new options. */
  reset(opts?: DrunkOptions) {
    const { min, max, startsAt, step } = parseOptions(opts);

    this.setRange({ min, max });
    this.setStepSize({ step });

    const initialValue =
      typeof opts?.startsAt !== 'undefined' ? startsAt : this._initialValue.next();

    this.state = {
      ...this.state,
      initialValue,
      value: initialValue,
    };
  }

  /** Returns the current value. */
  value() {
    return this.state.value;
  }

  /** Advances one step and returns the new value. */
  next() {
    const { min, max, step, value } = this.state;
    const updates = clamp(value + max * this._step.next() * step, min, max);

    this.state.value = updates;

    return updates;
  }
}

/**
 * Stochastic random walk generator that produces values within a bounded range.
 * Alternative form of `new Drunk(opts)`.
 */
export const drunk = Drunk.drunk;
