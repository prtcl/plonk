
import clamp from './clamp';
import toNumber from './toNumber';

// Linear map of `value` in `minIn...maxIn` range to `minOut...maxOut` range.

export default function scale (n, a1, a2, b1, b2) {
  n = toNumber(n, 0);
  a1 = toNumber(a1, 0);
  a2 = toNumber(a2, 1);
  b1 = toNumber(b1, 0);
  b2 = toNumber(b2, 1);
  return b1 + (clamp(n, a1, a2) - a1) * (b2 - b1) / (a2 - a1);
}
