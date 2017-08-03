
// flattens and (potentially) optimizes try/catch of a function call with rest args

export default function tryFn (fn, ...args) {
  if (typeof fn !== 'function') {
    throw new TypeError('tryFn requires a function');
  }

  let err, res;

  try {
    res = fn(...args);
  } catch (e) {
    err = e;
  }

  return [err, res];
}
