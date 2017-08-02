
import delay from './delay';
import rand from './rand';
import toNumber from './toNumber';

// Timer function where the tick interval jitters between `min...max` milliseconds.

export default function dust (min, max, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('delay callback needs to be a function');
  }

  min = toNumber(min, 10);
  max = toNumber(max, 100);

  if (arguments.length <= 2) {
    max = min;
    min = 0;
  }

  return delay(rand(min, max), (...args) => {
    callback(...args);

    return rand(min, max);
  });
}
