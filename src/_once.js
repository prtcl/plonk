
// Wraps the passed function so that it can only be called only once
// If multiple functions are passed, an array of wrapped functions is returned
// Only one function may be called once, then all subsuquent calls to any of them are ignored

export default function once (...fns) {
  const ret = [];
  let called = false;

  for (let fn of [...fns]) {
    let res = void 0,
        wrapped;
    if (typeof fn === 'function') {
      wrapped = (...args) => {
        if (!called) {
          res = fn(...args);
          called = true;
        }
        return res;
      };
    } else {
      wrapped = () => {
        called = true;
      };
    }
    ret.push(wrapped);
  }

  return ret.length > 1 ? ret : ret[0];
}
