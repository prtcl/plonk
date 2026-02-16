export function wrap(n: number): number;
export function wrap(n: number, max: number): number;
export function wrap(n: number, min: number, max: number): number;

/**
 * Wraps a value around a range using modular arithmetic.
 * @param n - The input value.
 * @param min - Lower bound (defaults to 0).
 * @param max - Upper bound (defaults to 1).
 * @returns The wrapped value within the range.
 */
export function wrap(n: number, min?: number, max?: number) {
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
  const range = Math.max(a, b) - lo;

  if (range === 0) return lo;

  const offset = n - lo;

  return lo + (((offset % range) + range) % range);
}
