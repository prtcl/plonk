
// well, it, uh, tries a function
// intended for use with array destructuring:
//   let [res, err] = tryFn(...)

export default function tryFn (fn, ...args) {
  if (typeof fn !== 'function') {
    throw new TypeError('tryFn requires a function as first argument');
  }

  let res, err;

  try {
    res = fn(...args);
  } catch (e) {
    err = e;
  }

  return [res, err];
}
