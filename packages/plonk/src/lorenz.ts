import { clamp } from './clamp';

// Classic Lorenz parameters, randomized slightly per instance for unique trajectories.
const BASE_SIGMA = 10;
const BASE_RHO = 28;
const SIGMA_SPREAD = 2;
const RHO_SPREAD = 4;

// Damping maps 0...1 to beta. Range chosen to keep the system bounded but chaotic.
const BETA_MIN = 1;
const BETA_MAX = 3.45;
const DEFAULT_DAMPING = (8 / 3 - BETA_MIN) / (BETA_MAX - BETA_MIN);

// Rate maps 0...1 to RK4 step size.
const RATE_MIN = Number.EPSILON;
const RATE_MAX = 0.135;
const DEFAULT_RATE = 0.01;

// Empirical bounds for normalizing raw coordinates to -1...1.
const X_MAX = 25;
const Y_MAX = 30;
const Z_MAX = 50;
const Z_CENTER = Z_MAX / 2;

/** Options for configuring a Lorenz attractor. */
export type LorenzOptions = {
  /** Damping factor (0-1). 0 is maximally chaotic, 1 is nearly periodic. Defaults to classic Lorenz (~0.238). */
  damping?: number;
  /** Evolution speed (0-1). 0 is nearly frozen, 1 is maximum speed. Defaults to ~0.1. */
  rate?: number;
};

/** Internal state of a Lorenz attractor. The x/y/z values are raw (unnormalized). */
export type LorenzState = {
  damping: number;
  rate: number;
  x: number;
  y: number;
  z: number;
};

/** Normalized output vector with each axis in the -1...1 range. */
export type LorenzValue = { x: number; y: number; z: number };

export const parseOptions = (opts?: LorenzOptions): Required<LorenzOptions> => {
  return {
    damping: opts && typeof opts.damping === 'number' ? clamp(opts.damping, 0, 1) : DEFAULT_DAMPING,
    rate:
      opts && typeof opts.rate === 'number'
        ? clamp(opts.rate, 0, 1)
        : (DEFAULT_RATE - RATE_MIN) / (RATE_MAX - RATE_MIN),
  };
};

export const getInitialState = (rate: number, damping: number): LorenzState => {
  return {
    damping,
    rate,
    x: (Math.random() * 2 - 1) * X_MAX,
    y: (Math.random() * 2 - 1) * Y_MAX,
    z: Math.random() * Z_MAX,
  };
};

/**
 * Lorenz attractor — deterministic chaotic system producing three coupled outputs as x/y/z vector.
 * @param opts - {@link LorenzOptions} for configuring the attractor.
 */
export class Lorenz {
  state: LorenzState;
  protected _beta: number;
  protected _sigma: number;
  protected _rho: number;

  /** Creates a new Lorenz instance. Alternative form of `new Lorenz(opts)`. */
  static lorenz(opts?: LorenzOptions) {
    return new Lorenz(opts);
  }

  constructor(opts?: LorenzOptions) {
    const { damping, rate } = parseOptions(opts);

    this._beta = dampingToBeta(damping);
    this._sigma = BASE_SIGMA + (Math.random() * 2 - 1) * SIGMA_SPREAD;
    this._rho = BASE_RHO + (Math.random() * 2 - 1) * RHO_SPREAD;
    this.state = getInitialState(rate, damping);

    // Settle onto the attractor before first use.
    let initial = 1000;
    while (initial--) {
      this.next();
    }
  }

  /** Returns the current {@link LorenzValue} vector. */
  value(): LorenzValue {
    const { x, y, z } = this.state;
    return normalize(x, y, z);
  }

  /** Updates the evolution speed (0 = nearly frozen, 1 = maximum). */
  setRate(rate: number) {
    this.state.rate = clamp(rate, 0, 1);
  }

  /** Updates the damping factor (0 = chaotic, 1 = periodic). */
  setDamping(damping: number) {
    this.state.damping = clamp(damping, 0, 1);
    this._beta = dampingToBeta(this.state.damping);
  }

  /** Advances the system one step (RK4) and returns the {@link LorenzValue} vector. */
  next() {
    const { x, y, z } = rk4(this.state, this._sigma, this._rho, this._beta);

    this.state.x = x;
    this.state.y = y;
    this.state.z = z;

    return this.value();
  }
}

/**
 * Lorenz attractor — a deterministic chaotic system producing three coupled outputs.
 * Alternative form of `new Lorenz(opts)`.
 */
export const lorenz = Lorenz.lorenz;

type Vec3 = [number, number, number];

// dx/dt = σ(y-x), dy/dt = x(ρ-z)-y, dz/dt = xy-βz
function derivatives(
  x: number,
  y: number,
  z: number,
  sigma: number,
  rho: number,
  beta: number
): Vec3 {
  return [sigma * (y - x), x * (rho - z) - y, x * y - beta * z];
}

// Fourth-order Runge-Kutta integration step.
function rk4(state: LorenzState, sigma: number, rho: number, beta: number): LorenzValue {
  const { x, y, z } = state;
  const h = rateToStep(state.rate);

  const k1 = derivatives(x, y, z, sigma, rho, beta);
  const k2 = derivatives(
    x + k1[0] * h * 0.5,
    y + k1[1] * h * 0.5,
    z + k1[2] * h * 0.5,
    sigma,
    rho,
    beta
  );
  const k3 = derivatives(
    x + k2[0] * h * 0.5,
    y + k2[1] * h * 0.5,
    z + k2[2] * h * 0.5,
    sigma,
    rho,
    beta
  );
  const k4 = derivatives(x + k3[0] * h, y + k3[1] * h, z + k3[2] * h, sigma, rho, beta);

  return {
    x: x + (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    y: y + (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    z: z + (h / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  };
}

function dampingToBeta(damping: number) {
  return BETA_MIN + damping * (BETA_MAX - BETA_MIN);
}

function rateToStep(rate: number) {
  return RATE_MIN + rate * (RATE_MAX - RATE_MIN);
}

// Scale raw coordinates to -1...1 range, clamped at the edges.
function normalize(x: number, y: number, z: number): LorenzValue {
  return {
    x: clamp(x / X_MAX, -1, 1),
    y: clamp(y / Y_MAX, -1, 1),
    z: clamp((z - Z_CENTER) / Z_CENTER, -1, 1),
  };
}
