import { clamp } from './clamp';

/**
 * Scales 0...1 by Euler's number to produce a natural feeling curve.
 * @param n - Input value (clamped to 0-1).
 * @returns The exponentially scaled value.
 */
export function expo(n: number): number {
  return Math.pow(clamp(n, 0, 1), Math.E);
}
