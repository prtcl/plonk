
// Wraps the passed function so that it can only be called only once

export default function once (fn) {
  let called = false,
      res;

  return function (...args) {
    if (!called) {
      res = fn(...args);
      called = true;
    }
    return res;
  };
}
