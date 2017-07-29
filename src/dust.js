
import delay from './delay';
import noop from './_noop';
import rand from './rand';
import toNumber from './toNumber';

// Timer function where the tick interval jitters between `min...max` milliseconds.

export default function dust (min, max, callback = noop) {
  min = toNumber(min, 10);
  max = toNumber(max, 100);

  if (arguments.length <= 2) {
    max = min;
    min = 0;
  }

  return delay(rand(min, max), (interval, i, elapsed, stop) => {
    callback(interval, i, elapsed, stop);
    return rand(min, max);
  });
}
