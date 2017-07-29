
import clamp from './clamp';
import toNumber from './toNumber';

// An exponential map of `value` in `0...1` range by Euler's number

export default function exp (n) {
  n = toNumber(n, 0);
  return Math.pow(clamp(n, 0, 1), Math.E);
}
