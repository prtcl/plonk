import { describe, it, expect } from 'vitest';
import { wrap, Wrap } from '../wrap';

describe('Wrap', () => {
  it('wraps values within the configured range', () => {
    const w = new Wrap({ min: 0, max: 10 });

    expect(w.wrap(5)).toBe(5);
    expect(w.wrap(12)).toBe(2);
    expect(w.wrap(-3)).toBe(7);
  });

  it('caches the last result in value()', () => {
    const w = new Wrap({ min: 0, max: 10 });

    expect(w.value()).toBe(0);

    const result = w.wrap(12);

    expect(result).toBe(2);
    expect(w.value()).toBe(2);
  });

  it('defaults to 0...1 range', () => {
    const w = new Wrap();

    expect(w.wrap(0.5)).toBe(0.5);
    expect(w.wrap(1.3)).toBeCloseTo(0.3);
  });

  it('updates range with setRange', () => {
    const w = new Wrap({ min: 0, max: 10 });

    w.wrap(5);
    w.setRange({ min: 0, max: 4 });

    expect(w.state.min).toBe(0);
    expect(w.state.max).toBe(4);
    // Previous value (5) gets wrapped into new range [0, 4]
    expect(w.value()).toBe(1);
  });

  it('produces a circular sequence', () => {
    const w = new Wrap({ min: 0, max: 10 });
    const sequence = Array.from({ length: 8 }, (_, i) => w.wrap(i * 3));

    expect(sequence).toEqual([0, 3, 6, 9, 2, 5, 8, 1]);
  });

  it('has a static factory', () => {
    const w = Wrap.wrap({ min: 0, max: 10 });
    expect(w).toBeInstanceOf(Wrap);
    expect(w.wrap(12)).toBe(2);
  });

  it('exposes state', () => {
    const w = new Wrap({ min: -180, max: 180 });

    expect(w.state).toEqual({ min: -180, max: 180, value: -180 });

    w.wrap(190);

    expect(w.state).toEqual({ min: -180, max: 180, value: -170 });
  });
});

describe('wrap', () => {
  it('is exported and returns a Wrap instance', () => {
    expect(wrap()).toBeInstanceOf(Wrap);
  });
});
