import { describe, it, expect } from 'vitest';
import { wrap } from '../wrap';

describe('wrap', () => {
  it('wraps values around a range', () => {
    expect(wrap(5, 0, 10)).toBe(5);
    expect(wrap(12, 0, 10)).toBe(2);
    expect(wrap(20, 0, 10)).toBe(0);
    expect(wrap(-3, 0, 10)).toBe(7);
  });

  it('defaults to 0...1 range', () => {
    expect(wrap(0.5)).toBe(0.5);
    expect(wrap(1.3)).toBeCloseTo(0.3);
    expect(wrap(-0.2)).toBeCloseTo(0.8);
  });

  it('accepts a single max argument', () => {
    expect(wrap(7, 5)).toBe(2);
    expect(wrap(12, 10)).toBe(2);
  });

  it('produces a circular sequence', () => {
    const sequence = Array.from({ length: 8 }, (_, i) => wrap(i * 3, 0, 10));
    expect(sequence).toEqual([0, 3, 6, 9, 2, 5, 8, 1]);
  });

  it('handles negative ranges', () => {
    expect(wrap(190, -180, 180)).toBe(-170);
    expect(wrap(-200, -180, 180)).toBe(160);
  });
});
