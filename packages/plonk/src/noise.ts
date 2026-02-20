import { clamp } from './clamp';

/** Options for configuring a Noise generator. */
export type NoiseOptions = {
  /** Crossfade between pink (0) and white (1) noise. Defaults to 0. */
  balance?: number;
  /** Number of octave bands. More octaves extend the low-frequency depth. Defaults to 8. */
  octaves?: number;
};

/** Snapshot of a Noise generator's internal state. */
export type NoiseState = {
  balance: number;
  octaves: number;
  sum: number;
  value: number;
};

export const parseOptions = (opts?: NoiseOptions): Required<NoiseOptions> => {
  return {
    balance: 0,
    octaves: 8,
    ...opts,
  };
};

const getInitialState = (octaves: number, balance: number, bands: Float64Array): NoiseState => {
  const sum = bands.reduce((res, n) => res + n, 0);
  return {
    balance,
    octaves,
    sum,
    value: sum / octaves,
  };
};

/**
 * Noise generator using the Voss-McCartney algorithm with pink/white balance.
 * @param opts - {@link NoiseOptions} for configuring octave bands and balance.
 */
export class Noise {
  state: NoiseState;
  protected _bands: Float64Array;
  protected _counter: number;

  /** Creates a new Noise instance. Alternative form of `new Noise(opts)`. */
  static noise(opts?: NoiseOptions) {
    return new Noise(opts);
  }

  constructor(opts?: NoiseOptions) {
    const { balance, octaves } = parseOptions(opts);

    this._bands = new Float64Array(octaves).map(() => Math.random() * 2 - 1);
    this._counter = 0;
    this.state = getInitialState(octaves, clamp(balance, 0, 1), this._bands);
  }

  /** Returns the current noise value. */
  value() {
    return this.state.value;
  }

  /** Updates the pink/white crossfade balance (0 = pink, 1 = white). */
  setBalance(balance: number) {
    this.state.balance = clamp(balance, 0, 1);
  }

  /** Advances the generator and returns the next noise sample (-1...1). */
  next() {
    const { balance } = this.state;
    this._counter++;

    const band = ctz(this._counter);
    if (band < this.state.octaves) {
      const prev = this._bands[band];
      const next = Math.random() * 2 - 1;

      this._bands[band] = next;
      this.state.sum += next - prev;
    }

    const pink = this.state.sum / this.state.octaves;
    const white = Math.random() * 2 - 1;

    this.state.value = pink * (1 - balance) + white * balance;

    return this.state.value;
  }
}

/**
 * Noise generator using the Voss-McCartney algorithm with pink/white balance.
 * Alternative form of `new Noise(opts)`.
 */
export const noise = Noise.noise;

/** Count trailing zeros in a 32-bit integer. */
function ctz(n: number): number {
  if (n === 0) return 32;
  return 31 - Math.clz32(n & -n);
}
