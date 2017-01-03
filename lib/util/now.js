
/**
 * High resolution timestamp that uses `performance.now()` in the browser, or `process.hrtime()` in Node. Provides a Date-based fallback otherwise.
 * @static
 * @memberof plonk
 * @name now
 * @returns {number} elapsed time in milliseconds
 * @example
 * plonk.now();
 * // => 2034.65879
 */
module.exports = (function () {
  var offset, now;
  if (typeof performance !== 'undefined' && ('now' in performance)) {
    return function () {
      return performance.now();
    };
  } else if (typeof process === 'object' && process.toString() === '[object process]') {
    now = function () {
      var hr = process.hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    offset = now();
    return function () {
      return (now() - offset) / 1e6;
    };
  }
  now = (Date.now || function () {
    return (new Date()).getTime();
  });
  offset = now();
  return function () {
    return now() - offset;
  };
})();
