import { describe, it, expect } from 'vitest';
import { wrap } from '../wrap';

describe('wrap', () => {
  it('wraps values around a range', () => {
    // Within range — unchanged
    expect(wrap(5, 0, 10)).toBe(5);

    // Past max — wraps around
    expect(wrap(12, 0, 10)).toBe(2);
    expect(wrap(20, 0, 10)).toBe(0);

    // Below min — wraps from the top
    expect(wrap(-3, 0, 10)).toBe(7);

    // Negative ranges
    expect(wrap(190, -180, 180)).toBe(-170);
  });
});
