import { describe, it, expect } from 'vitest';
import { fold, Fold } from '../fold';

describe('Fold', () => {
  it('folds values within the configured range', () => {
    const f = new Fold({ min: 0, max: 10 });

    expect(f.fold(5)).toBe(5);
    expect(f.fold(12)).toBe(8);
    expect(f.fold(-3)).toBe(3);
  });

  it('caches the last result in value()', () => {
    const f = new Fold({ min: 0, max: 10 });

    expect(f.value()).toBe(0);

    const result = f.fold(12);

    expect(result).toBe(8);
    expect(f.value()).toBe(8);
  });

  it('defaults to 0...1 range', () => {
    const f = new Fold();

    expect(f.fold(0.5)).toBe(0.5);
    expect(f.fold(1.3)).toBeCloseTo(0.7);
  });

  it('updates range with setRange', () => {
    const f = new Fold({ min: 0, max: 10 });

    f.fold(5);
    f.setRange({ min: 0, max: 4 });

    expect(f.state.min).toBe(0);
    expect(f.state.max).toBe(4);
    // Previous value (5) gets folded into new range [0, 4]
    expect(f.value()).toBe(3);
  });

  it('produces a zigzag sequence', () => {
    const f = new Fold({ min: 0, max: 10 });
    const sequence = Array.from({ length: 7 }, (_, i) => f.fold(i * 5));

    expect(sequence).toEqual([0, 5, 10, 5, 0, 5, 10]);
  });

  it('has a static shorthand', () => {
    expect(Fold.fold(12, { min: 0, max: 10 })).toBe(8);
    expect(Fold.fold(1.3)).toBeCloseTo(0.7);
  });

  it('exposes state', () => {
    const f = new Fold({ min: -5, max: 5 });

    expect(f.state).toEqual({ min: -5, max: 5, value: -5 });

    f.fold(7);

    expect(f.state).toEqual({ min: -5, max: 5, value: 3 });
  });
});

describe('fold', () => {
  it('is exported and returns a number', () => {
    expect(typeof fold(0.5)).toBe('number');
  });
});
