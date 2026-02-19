import { describe, it, expect } from 'vitest';
import { Noise, noise } from '../noise';

describe('Noise', () => {
  it('produces values in the -1...1 range', () => {
    const n = new Noise({ octaves: 8 });

    for (let i = 0; i < 1000; i++) {
      const val = n.next();
      expect(val).toBeGreaterThanOrEqual(-1);
      expect(val).toBeLessThanOrEqual(1);
    }
  });

  it('produces varying output', () => {
    const n = new Noise({ octaves: 8 });
    const values = new Set<number>();

    for (let i = 0; i < 100; i++) {
      values.add(n.next());
    }

    expect(values.size).toBeGreaterThan(1);
  });

  it('bounds consecutive deltas to one band contribution with pure pink', () => {
    const n = new Noise({ octaves: 4, balance: 0 });

    const deltas: number[] = [];
    let prev = n.value();

    for (let i = 0; i < 16; i++) {
      const val = n.next();
      deltas.push(Math.abs(val - prev));
      prev = val;
    }

    // Each step changes at most one band (2/octaves range swing).
    const maxDelta = 2 / 4;
    for (const delta of deltas) {
      expect(delta).toBeLessThanOrEqual(maxDelta + 1e-10);
    }
  });

  it('defaults to 8 octaves and balance 0', () => {
    const n = new Noise();
    expect(n.state.octaves).toEqual(8);
    expect(n.state.balance).toEqual(0);
  });

  it('respects custom octave count', () => {
    const n = new Noise({ octaves: 16 });
    expect(n.state.octaves).toEqual(16);
  });

  it('blends white noise via balance', () => {
    // At balance 1 (pure white), consecutive samples should vary widely.
    const n = new Noise({ octaves: 8, balance: 1 });
    const values = new Set<number>();

    for (let i = 0; i < 50; i++) {
      values.add(n.next());
    }

    expect(values.size).toEqual(50);
  });

  it('updates balance via setBalance', () => {
    const n = new Noise({ octaves: 8 });
    expect(n.state.balance).toEqual(0);

    n.setBalance(0.5);
    expect(n.state.balance).toEqual(0.5);
  });

  it('clamps balance to 0...1', () => {
    const n = new Noise({ balance: 2 });
    expect(n.state.balance).toEqual(1);

    n.setBalance(-0.5);
    expect(n.state.balance).toEqual(0);
  });
});

describe('noise', () => {
  it('is exported and returns a Noise instance', () => {
    expect(noise()).toBeInstanceOf(Noise);
  });
});
