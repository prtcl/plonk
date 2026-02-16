import { clamp } from './clamp';

function logistic(v: number, k: number): number {
  return 1 / (1 + Math.exp(-k * (v - 0.5)));
}

/**
 * A normalized sigmoid curve which maps 0...1 → 0...1 for use as a transfer function or waveshaper.
 *
 * The steepness parameter `k` controls the shape — higher values produce a
 * more aggressive S-curve, while  k = 0 it's linear.
 * @param n - Input value (clamped to 0...1).
 * @param k - Steepness of the curve (default 5).
 * @returns The shaped value.
 */
export function sigmoid(n: number, k = 5): number {
  const x = clamp(n, 0, 1);
  if (k === 0) return x;

  const f0 = logistic(0, k);

  return (logistic(x, k) - f0) / (logistic(1, k) - f0);
}
