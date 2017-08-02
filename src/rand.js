
import toNumber from './toNumber';

// Returns a random number in `min...max` range.

export default function rand (min, max) {
  if (arguments.length <= 1) {
    max = toNumber(min, 1);
    min = 0;
  } else {
    min = toNumber(min, 0);
    max = toNumber(max, 1);
  }

  return Math.random() * (max - min) + min;
}
