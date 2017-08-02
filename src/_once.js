
// Wraps the passed function so that it can only be called only once
// If multiple functions are passed, an array of wrapped functions is returned
// Only one function may be called once, then all subsuquent calls to any of them are ignored

export default function once (...fns) {
  let called = false;

  const ret = fns.map((fn) => {
    let res = void 0;

    if (typeof fn === 'function') {
      return (...args) => {
        if (!called) {
          res = fn(...args);
          called = true;
        }
        return res;
      };
    }

    return () => {
      called = true;
    };
  });

  return ret.length > 1 ? ret : ret[0];
}
