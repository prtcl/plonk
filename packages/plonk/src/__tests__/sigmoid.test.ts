import { describe, it, expect } from 'vitest';
import { sigmoid } from '../sigmoid';

describe('sigmoid', () => {
  it('maps 0...1 through a normalized S-curve', () => {
    expect(sigmoid(0)).toEqual(0);
    expect(sigmoid(0.5)).toBeCloseTo(0.5);
    expect(sigmoid(1)).toEqual(1);
  });

  it('produces values below linear in the lower half', () => {
    expect(sigmoid(0.25)).toBeLessThan(0.25);
  });

  it('produces values above linear in the upper half', () => {
    expect(sigmoid(0.75)).toBeGreaterThan(0.75);
  });

  it('clamps input to 0...1', () => {
    expect(sigmoid(-5)).toEqual(0);
    expect(sigmoid(99)).toEqual(1);
  });

  it('approaches linear when k = 0', () => {
    expect(sigmoid(0.25, 0)).toEqual(0.25);
    expect(sigmoid(0.75, 0)).toEqual(0.75);
  });

  it('gets more aggressive with higher k', () => {
    const gentle = sigmoid(0.25, 2);
    const steep = sigmoid(0.25, 20);

    expect(steep).toBeLessThan(gentle);
  });
});
