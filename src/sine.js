
import clamp from './clamp';
import metro from './metro';
import scale from './scale';
import toNumber from './toNumber';

const SINE_PERIOD = (Math.PI * 2) - 0.0001;

// A sine LFO where `period` is the time, in milliseconds, of one full cycle.

export default function sine (time, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('sine callback needs to be a function');
  }

  time = toNumber(time, 0);

  let cycle = 0;

  return metro(1000 / 60, (interval, i, elapsed, stop) => {
    if (cycle >= time) {
      cycle = 0;
    } else {
      cycle += interval;
    }

    const rad = scale(cycle, 0, time, 0, SINE_PERIOD),
          sin = clamp(Math.sin(rad), -1, 1);

    const progress = callback(sin, cycle, elapsed, stop);
    time = toNumber(progress, time);

    return sin;
  });
}
