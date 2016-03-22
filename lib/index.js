
/** @namespace */
var plonk = {
  constrain: require('./math/constrain'),
  debounce: require('./util/debounce'),
  defer: require('./util/defer'),
  delay: require('./timers/delay'),
  drunk: require('./math/drunk'),
  dust: require('./timers/dust'),
  env: require('./generators/env'),
  exp: require('./math/exp'),
  frames: require('./timers/frames'),
  metro: require('./timers/metro'),
  ms: require('./util/toMilliseconds'),
  now: require('./util/now'),
  rand: require('./math/rand'),
  scale: require('./math/scale'),
  sine: require('./generators/sine'),
  tick: require('./util/tick'),
  toMilliseconds: require('./util/toMilliseconds'),
  toNumber: require('./util/toNumber'),
  wait: require('./timers/wait'),
  walk: require('./timers/walk')
};

module.exports = plonk;
