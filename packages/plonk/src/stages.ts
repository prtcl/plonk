import { Env, type EnvOptions, parseOptions } from './env';

/** Snapshot of a Stages sequencer's internal state. */
export type StagesState = {
  active: number;
  isRunning: boolean;
};

/**
 * Sequences multiple Env stages, auto-connecting from/to values between stages.
 * @param configs - Array of {@link EnvOptions} for each stage.
 */
export class Stages {
  state: StagesState;
  protected _stages: Env[];

  /** Creates a new Stages instance. Alternative form of `new Stages(configs)`. */
  static stages(configs: EnvOptions[]) {
    return new Stages(configs);
  }

  constructor(configs: EnvOptions[]) {
    validateConfigs(configs);
    const resolved = configs.map((c) => parseOptions(c));

    this._stages = configs.map((config, i) => {
      if (i > 0 && config.from === undefined) {
        const prev = resolved[i - 1];
        return new Env({ ...config, from: prev.to });
      }

      return new Env(config);
    });

    this.state = {
      active: 0,
      isRunning: false,
    };
  }

  /** Starts the sequence from the first stage. */
  start() {
    this.state.active = 0;
    this.state.isRunning = true;
    this._stages[0].start();
  }

  at(index: number) {
    return this._stages.at(index) ?? null;
  }

  first() {
    return this._stages[0];
  }

  last() {
    const last = this._stages.length - 1;
    return this._stages[last];
  }

  /** Returns true when all stages have completed. */
  done() {
    const last = this._stages.length - 1;
    return this.state.active >= last && this.last().done();
  }

  /** Returns the current value from the active stage. */
  value() {
    const active = this._stages[this.state.active];
    return active.value();
  }

  /** Advances the active stage and returns the current value. */
  next() {
    if (!this.state.isRunning) return this.value();
    if (this.done()) {
      this.state.isRunning = false;
      return this.value();
    }

    const active = this._stages[this.state.active];
    active.next();

    if (active.done() && this.state.active < this._stages.length - 1) {
      this.state.active++;
      this._stages[this.state.active].start();
    }

    if (this.done()) {
      this.state.isRunning = false;
    }

    return this.value();
  }
}

/**
 * Sequences multiple Env stages, auto-connecting from/to values between stages.
 * Alternative form of `new Stages(configs)`.
 */
export const stages = Stages.stages;

function validateConfigs(value: EnvOptions[]) {
  if (value.length === 0) {
    throw new Error(`stages: at least one stage is required`);
  }
}
