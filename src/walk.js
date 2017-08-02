
import delay from './delay';
import drunk from './drunk';
import toNumber from './toNumber';

// Timer function where the tick interval performs a drunk walk between `min...max` milliseconds

export default function walk (min, max, callback) {
  min = toNumber(min, 10);
  max = toNumber(max, 100);

  if (arguments.length <= 2) {
    max = min;
    min = 0;
  }

  const d = drunk(min, max);

  return delay(d(), (...args) => {
    let progress;

    if (typeof callback === 'function') {
      progress = callback(...args);
    }

    return d(progress);
  });
}
