/**
 * Folds (reflects) a value back and forth within a range.
 * @param n - The input value.
 * @param min - Lower bound of the range.
 * @param max - Upper bound of the range.
 * @returns The folded value within [min, max].
 */
export function fold(n: number, min: number, max: number): number {
  const range = max - min;
  // Normalize to [0, range], then fold within [0, 2*range)
  const offset = (((n - min) % (2 * range)) + 2 * range) % (2 * range);
  return offset <= range ? min + offset : max - (offset - range);
}
