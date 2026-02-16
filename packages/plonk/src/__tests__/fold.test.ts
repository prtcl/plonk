import { describe, it, expect } from 'vitest';
import { fold } from '../fold';

describe('fold', () => {
  it('folds values back and forth within a range', () => {
    expect(fold(5, 0, 10)).toBe(5);
    expect(fold(12, 0, 10)).toBe(8);
    expect(fold(15, 0, 10)).toBe(5);
    expect(fold(-3, 0, 10)).toBe(3);
  });

  it('defaults to 0...1 range', () => {
    expect(fold(0.5)).toBe(0.5);
    expect(fold(1.3)).toBeCloseTo(0.7);
    expect(fold(-0.2)).toBeCloseTo(0.2);
  });

  it('accepts a single max argument', () => {
    expect(fold(7, 5)).toBeCloseTo(3);
    expect(fold(12, 10)).toBeCloseTo(8);
  });

  it('produces a zigzag sequence', () => {
    const sequence = Array.from({ length: 5 }, (_, i) => fold(i * 5, 0, 10));
    expect(sequence).toEqual([0, 5, 10, 5, 0]);
  });

  it('completes a full bounce cycle', () => {
    const sequence = Array.from({ length: 7 }, (_, i) => fold(i * 5, 0, 10));
    expect(sequence).toEqual([0, 5, 10, 5, 0, 5, 10]);
  });

  it('stays within bounds at exact boundaries', () => {
    expect(fold(0, 0, 10)).toBe(0);
    expect(fold(10, 0, 10)).toBe(10);
    expect(fold(20, 0, 10)).toBe(0);
    expect(fold(30, 0, 10)).toBe(10);
  });
});
