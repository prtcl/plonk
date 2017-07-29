
import metro from './metro';
import noop from './_noop';
import scale from './scale';
import toNumber from './toNumber';

// An envelope that provides linear interpolation of `value` to `target` over `time`

export default function env (value, target, time, callback = noop) {
  value = toNumber(value, 0);
  target = toNumber(target, 1);
  time = toNumber(time, 100);

  return metro(1000 / 60, (interval, i, elapsed, stop) => {
    if (elapsed >= time) {
      stop(target);
    }

    const interpolated = scale(elapsed, 0, time, value, target);
    callback(interpolated);

    return interpolated;
  });

}
