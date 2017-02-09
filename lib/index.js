
import clamp from './math/clamp';
import defer from './util/defer';
import delay from './time/delay';
import drunk from './math/drunk';
import dust from './time/dust';
import env from './time/env';
import exp from './math/exp';
import frames from './time/frames';
import metro from './time/metro';
import now from './util/now';
import rand from './math/rand';
import scale from './math/scale';
import sine from './time/sine';
import toMilliseconds from './util/toMilliseconds';
import wait from './time/wait';
import walk from './time/walk';

/** @namespace */
const plonk = {
  clamp,
  defer,
  delay,
  drunk,
  dust,
  env,
  exp,
  frames,
  metro,
  ms: toMilliseconds,
  now,
  rand,
  scale,
  sine,
  wait,
  walk
};

export default plonk;
