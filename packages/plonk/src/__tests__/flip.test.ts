import { describe, it, expect } from 'vitest';
import { flip } from '../utils/flip';

describe('flip', () => {
  it('just inverts the sign of incoming numbers', () => {
    expect(flip(5)).toEqual(-5);
    expect(flip(-5)).toEqual(5);
  });
});
