import { clamp } from './clamp';

/**
 * A normalized tanh curve which maps -1...1 → -1...1 for use as a transfer function or waveshaper.
 *
 * The steepness parameter `k` controls saturation — higher values push the
 * curve toward hard clipping at the edges, while at k = 0 it's linear.
 * @param n - Input value (clamped to -1...1).
 * @param k - Steepness of the curve (default 5).
 * @returns The shaped value.
 */
export function tanh(n: number, k = 5): number {
  const x = clamp(n, -1, 1);
  if (k === 0) return x;

  return Math.tanh(k * x) / Math.tanh(k);
}
