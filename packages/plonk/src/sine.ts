import { now } from './now';

export const SINE_PERIOD = Math.PI * 2;

/** Options for configuring a Sine oscillator. */
export type SineOptions = {
  /** Duration of one full cycle in milliseconds. */
  duration: number;
};

/** Snapshot of a Sine oscillator's internal state. */
export type SineState = {
  duration: number;
  phase: number;
  prev: number;
  totalElapsed: number;
  value: number;
};

const getInitialState = (duration: number): SineState => ({
  duration,
  phase: 0,
  prev: now(),
  totalElapsed: 0,
  value: 0,
});

/**
 * Time-based sine wave oscillator that outputs values between -1 and 1.
 * @param opts - {@link SineOptions} for configuring the oscillator.
 */
export class Sine {
  state: SineState;

  /** Creates a new Sine instance. Alternative form of `new Sine(opts)`. */
  static sine(opts: SineOptions) {
    return new Sine(opts);
  }

  constructor(opts: SineOptions) {
    this.state = getInitialState(opts.duration);
  }

  /** Updates the cycle duration. */
  setDuration(duration: number) {
    this.state.duration = duration;
  }

  /** Resets the oscillator with optional new options. */
  reset(opts?: SineOptions) {
    this.state = getInitialState(opts?.duration ?? this.state.duration);
  }

  /** Returns the current oscillator value. */
  value() {
    return this.state.value;
  }

  /** Advances the oscillator and returns the new value. */
  next() {
    const { duration, phase, prev, totalElapsed: prevTotalElapsed } = this.state;
    const curr = now();
    const tickInterval = curr - prev;
    const totalElapsed = prevTotalElapsed + tickInterval;

    const increment = SINE_PERIOD * (tickInterval / duration);
    const nextPhase = (phase + increment) % SINE_PERIOD;
    const updates = Math.sin(nextPhase);

    this.state.phase = nextPhase;
    this.state.prev = curr;
    this.state.totalElapsed = totalElapsed;
    this.state.value = updates;

    return updates;
  }
}

/**
 * Time-based sine wave oscillator that outputs values between -1 and 1.
 * Alternative form of `new Sine(opts)`.
 */
export const sine = Sine.sine;
