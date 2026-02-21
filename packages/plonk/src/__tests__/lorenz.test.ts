import { describe, it, expect } from 'vitest';
import { Lorenz, lorenz } from '../lorenz';

describe('Lorenz', () => {
  it('evolves from initial conditions', () => {
    const l = new Lorenz();
    const { x, y, z } = l.state;

    for (let i = 0; i < 10; i++) {
      l.next();
    }

    expect(l.state.x).not.toEqual(x);
    expect(l.state.y).not.toEqual(y);
    expect(l.state.z).not.toEqual(z);
  });

  it('produces normalized output in -1...1', () => {
    const l = new Lorenz();

    for (let i = 0; i < 10000; i++) {
      const { x, y, z } = l.next();

      expect(x).toBeGreaterThanOrEqual(-1);
      expect(x).toBeLessThanOrEqual(1);
      expect(y).toBeGreaterThanOrEqual(-1);
      expect(y).toBeLessThanOrEqual(1);
      expect(z).toBeGreaterThanOrEqual(-1);
      expect(z).toBeLessThanOrEqual(1);
    }
  });

  it('produces unique trajectories from randomized initial conditions', () => {
    const a = new Lorenz();
    const b = new Lorenz();

    for (let i = 0; i < 100; i++) {
      a.next();
      b.next();
    }

    expect(a.state.x).not.toEqual(b.state.x);
  });

  it('produces different trajectories at different damping values', () => {
    const a = new Lorenz({ damping: 0 });
    const b = new Lorenz({ damping: 1 });

    for (let i = 0; i < 1000; i++) {
      a.next();
      b.next();
    }

    expect(a.state.x).not.toEqual(b.state.x);
    expect(a.state.y).not.toEqual(b.state.y);
    expect(a.state.z).not.toEqual(b.state.z);
  });

  it('stays bounded at both damping extremes', () => {
    const low = new Lorenz({ damping: 0 });
    const high = new Lorenz({ damping: 1 });

    for (let i = 0; i < 10000; i++) {
      low.next();
      high.next();

      expect(Number.isFinite(low.state.x)).toEqual(true);
      expect(Number.isFinite(high.state.x)).toEqual(true);
    }
  });

  it('defaults damping to classic Lorenz beta', () => {
    const l = new Lorenz();

    expect(l.state.damping).toBeCloseTo((8 / 3 - 1) / (3.45 - 1), 10);
  });

  it('clamps damping to 0...1', () => {
    const l = new Lorenz({ damping: 5 });
    expect(l.state.damping).toEqual(1);

    l.setDamping(-1);
    expect(l.state.damping).toEqual(0);
  });

  it('updates rate via setRate and clamps to 0...1', () => {
    const l = new Lorenz();

    l.setRate(0.5);
    expect(l.state.rate).toEqual(0.5);

    l.setRate(2);
    expect(l.state.rate).toEqual(1);

    l.setRate(-1);
    expect(l.state.rate).toEqual(0);
  });

  it('returns normalized { x, y, z } from next() and value()', () => {
    const l = new Lorenz();

    for (let i = 0; i < 100; i++) {
      l.next();
    }

    const val = l.value();
    expect(val).toHaveProperty('x');
    expect(val).toHaveProperty('y');
    expect(val).toHaveProperty('z');

    const next = l.next();
    // next() and value() should agree after a tick
    const afterVal = l.value();
    expect(next.x).toEqual(afterVal.x);
    expect(next.y).toEqual(afterVal.y);
    expect(next.z).toEqual(afterVal.z);
  });
});

describe('lorenz', () => {
  it('is exported and returns a Lorenz instance', () => {
    expect(lorenz()).toBeInstanceOf(Lorenz);
  });
});
