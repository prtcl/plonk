export function clamp(n: number): number;
export function clamp(n: number, max: number): number;
export function clamp(n: number, min: number, max: number): number;

/**
 * Constrains an input value to a min...max range.
 * @param n - The value to constrain.
 * @param min - Lower bound (defaults to 0).
 * @param max - Upper bound (defaults to 1).
 * @returns The clamped value.
 */
export function clamp(n: number, min?: number, max?: number) {
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

  return Math.min(Math.max(n, a), b);
}
