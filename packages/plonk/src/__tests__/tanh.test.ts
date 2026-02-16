import { describe, it, expect } from 'vitest';
import { tanh } from '../tanh';

describe('tanh', () => {
  it('maps -1...1 through a normalized tanh curve', () => {
    expect(tanh(-1)).toEqual(-1);
    expect(tanh(0)).toEqual(0);
    expect(tanh(1)).toEqual(1);
  });

  it('saturates toward the edges', () => {
    expect(tanh(0.5)).toBeGreaterThan(0.5);
    expect(tanh(-0.5)).toBeLessThan(-0.5);
  });

  it('clamps input to -1...1', () => {
    expect(tanh(-99)).toEqual(-1);
    expect(tanh(99)).toEqual(1);
  });

  it('approaches linear when k = 0', () => {
    expect(tanh(0.5, 0)).toEqual(0.5);
    expect(tanh(-0.75, 0)).toEqual(-0.75);
  });

  it('gets more aggressive with higher k', () => {
    const gentle = tanh(0.5, 2);
    const steep = tanh(0.5, 20);

    expect(steep).toBeGreaterThan(gentle);
  });
});
