
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
export default function now () {
  return performanceNowHandler();
}

// try to choose the best method for producing a performance.now() timestamp
export const performanceNowHandler = (function () {

  if (typeof performance !== 'undefined' && ('now' in performance)) {

    return function () {
      return performance.now();
    };

  } else if (typeof process === 'object' && process.toString() === '[object process]') {

    return (function () {
      function n () {
        var hr = process.hrtime();
        return hr[0] * 1e9 + hr[1];
      }
      const offset = n();
      return function () {
        return (n() - offset) / 1e6;
      };
    })();

  }

  return (function () {
    const offset = Date.now();
    return function () {
      return Date.now() - offset;
    };
  })();

})();
