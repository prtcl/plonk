import { clamp } from '../utils';
import Rand from './Rand';

export const DEFAULT_DRUNK_STEP = 0.1;

export type DrunkOptions = {
  max?: number;
  min?: number;
  startsAt?: number;
  step?: number;
};

export type DrunkState = {
  initialValue: number;
  max: number;
  min: number;
  step: number;
  value: number;
};

export const parseStepSize = (step?: number): number =>
  typeof step !== 'undefined' ? clamp(step, 0, 1) : DEFAULT_DRUNK_STEP;

export const parseOptions = (opts?: DrunkOptions): DrunkOptions => {
  const { step, ...restOpts } = opts || {};
  const parsedStepSize = parseStepSize(step);

  return {
    max: 1,
    min: 0,
    startsAt: undefined,
    step: parsedStepSize,
    ...restOpts,
  };
};

export default class Drunk {
  state: DrunkState;
  protected _initialValue: Rand;
  protected _step: Rand;

  constructor(opts?: DrunkOptions) {
    const { min, max, step, startsAt } = parseOptions(opts);

    this._initialValue = new Rand({ min, max });
    this._step = new Rand({ min: -1, max: 1 });

    const initialValue =
      typeof startsAt !== 'undefined' ? startsAt : this._initialValue.value();

    this.state = {
      initialValue,
      max,
      min,
      step,
      value: initialValue,
    };
  }

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

  setStepSize(partialOpts?: Pick<DrunkOptions, 'step'>) {
    const step = parseStepSize(partialOpts.step);

    this.state = {
      ...this.state,
      step,
    };
  }

  reset(opts?: DrunkOptions) {
    const { min, max, startsAt, step } = parseOptions(opts);

    this.setRange({ min, max });
    this.setStepSize({ step });

    const initialValue =
      typeof startsAt !== 'undefined' ? startsAt : this._initialValue.next();

    this.state = {
      ...this.state,
      initialValue,
      value: initialValue,
    };
  }

  value() {
    return this.state.value;
  }

  next() {
    const { min, max, step, value } = this.state;
    const updates = clamp(value + max * this._step.next() * step, min, max);

    this.state.value = updates;

    return updates;
  }
}
