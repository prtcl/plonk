/**
 * Wraps a value around a range using modular arithmetic.
 * @param n - The input value.
 * @param min - Lower bound of the range.
 * @param max - Upper bound of the range.
 * @returns The wrapped value within [min, max).
 */
export function wrap(n: number, min: number, max: number): number {
  const range = max - min;
  return min + ((((n - min) % range) + range) % range);
}
