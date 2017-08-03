
import metro from './metro';
import scale from './scale';
import toNumber from './toNumber';

// An envelope that provides linear interpolation of `value` to `target` over `time`

export default function env (value, target, time, callback) {
  value = toNumber(value, 0);
  target = toNumber(target, 1);
  time = toNumber(time, 100);

  return metro(1000 / 60, (interval, i, elapsed, stop) => {
    const interpolated = scale(elapsed, 0, time, value, target);

    if (typeof callback === 'function') {
      callback(interpolated, elapsed, stop);
    }

    if (elapsed >= time) {
      stop(interpolated);
    }

    return interpolated;
  });

}
