import clamp from './clamp';

/** Scales 0...1 by Euler's number to produce a natural feeling curve. */
export default function expo(n: number): number {
  return Math.pow(clamp(n, 0, 1), Math.E);
}
