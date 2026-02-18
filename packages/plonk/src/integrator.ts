import { clamp } from './clamp';
import { now } from './now';

/** Options for configuring an Integrator. */
export type IntegratorOptions = {
  /** Smoothing factor between 0 and 1. Lower values are smoother. Defaults to 0.1. */
  factor?: number;
  /** Initial value. Defaults to 0. */
  value?: number;
};

/** Snapshot of an Integrator's internal state. */
export type IntegratorState = {
  factor: number;
  prev: number;
  target: number;
  value: number;
};

export const parseOptions = (opts?: IntegratorOptions): Required<IntegratorOptions> => {
  return {
    factor: 0.1,
    value: 0,
    ...opts,
  };
};

const SIXTY_FPS = 1000 / 60;

/**
 * Exponential integrator which continuously smooths toward a target value.
 * @param opts - {@link IntegratorOptions} for configuring the smoothing factor and initial value.
 */
export class Integrator {
  state: IntegratorState;

  /** Creates a new Integrator instance. Alternative form of `new Integrator(opts)`. */
  static integrator(opts?: IntegratorOptions) {
    return new Integrator(opts);
  }

  constructor(opts?: IntegratorOptions) {
    const { factor, value } = parseOptions(opts);

    this.state = {
      factor: clamp(factor, 0, 1),
      prev: now(),
      target: value,
      value,
    };
  }

  /** Returns the current smoothed value. */
  value() {
    return this.state.value;
  }

  /** Updates the smoothing factor. */
  setFactor(factor: number) {
    this.state.factor = clamp(factor, 0, 1);
  }

  /** Advances the integrator toward the target and returns the smoothed value. */
  next(target?: number) {
    if (typeof target === 'number') {
      this.state.target = target;
    }

    const { factor, value, target: to } = this.state;

    const curr = now();
    const dt = curr - this.state.prev;

    this.state.prev = curr;

    const alpha = 1 - Math.pow(1 - factor, dt / SIXTY_FPS);
    const updates = value + (to - value) * alpha;

    this.state.value = updates;

    return updates;
  }
}

/**
 * Exponential integrator which continuously smooths toward a target value.
 * Alternative form of `new Integrator(opts)`.
 */
export const integrator = Integrator.integrator;
