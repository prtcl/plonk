import { clamp } from './clamp';

export function fold(n: number): number;
export function fold(n: number, max: number): number;
export function fold(n: number, min: number, max: number): number;

/**
 * Folds (reflects) a value back and forth within a range.
 * @param n - The input value.
 * @param min - Lower bound (defaults to 0).
 * @param max - Upper bound (defaults to 1).
 * @returns The folded value within [min, max].
 */
export function fold(n: number, min?: number, max?: number) {
  let a = 0;
  let b = 1;

  if (typeof min === 'number') {
    if (typeof max === 'number') {
      a = min;
      b = max;
    } else {
      a = 0;
      b = min;
    }
  }

  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const range = hi - lo;

  if (range === 0) return lo;

  const period = range * 2;
  const offset = n - lo;

  // Normalize into one full bounce cycle [0, period)
  const normalized = ((offset % period) + period) % period;

  // First half travels forward, second half reflects back
  const value = normalized <= range ? lo + normalized : lo + period - normalized;

  return clamp(value, lo, hi);
}
