
import clamp from './clamp';
import rand from './rand';
import toNumber from './toNumber';

// Factory that returns a drunk walk random function that walks between `min...max`

export default function drunk (min, max, step) {
  min = toNumber(min, 0);
  max = toNumber(max, 1);
  step = clamp(toNumber(step, 0.1), 0, 1);
  if (arguments.length <= 1) {
    max = min || 1;
    min = 0;
  }
  var n = rand(min, max);
  return function (s) {
    step = toNumber(s, step);
    n = clamp(n + (max * rand(-1, 1) * step), min, max);
    return n;
  };
}
