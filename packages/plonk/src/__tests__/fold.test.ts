import { describe, it, expect } from 'vitest';
import { fold } from '../fold';

describe('fold', () => {
  it('folds values back and forth within a range', () => {
    // Within range — unchanged
    expect(fold(5, 0, 10)).toBe(5);

    // Past max — reflects back
    expect(fold(12, 0, 10)).toBe(8);
    expect(fold(15, 0, 10)).toBe(5);

    // Full bounce cycle
    expect(fold(20, 0, 10)).toBe(0);
    expect(fold(25, 0, 10)).toBe(5);
    expect(fold(30, 0, 10)).toBe(10);

    // Below min — reflects upward
    expect(fold(-3, 0, 10)).toBe(3);

    // At boundaries
    expect(fold(0, 0, 10)).toBe(0);
    expect(fold(10, 0, 10)).toBe(10);
  });
});
