
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

// try to choose the best method for producing a performance.now() timestamp

let now;

if (typeof performance !== 'undefined' && ('now' in performance)) {
  now = performanceNow;
} else if (typeof process === 'object' && process.toString() === '[object process]') {
  now = hrtimeNow.bind(null, hrtimeToTimestamp());
} else {
  now = dateNow.bind(null, Date.now());
}

export default now;

function performanceNow () {
  return performance.now();
}

function hrtimeToTimestamp () {
  const hr = process.hrtime();
  return hr[0] * 1e9 + hr[1];
}

function hrtimeNow (offset) {
  return (hrtimeToTimestamp() - offset) / 1e6;
}

function dateNow (offset) {
  return Date.now() - offset;
}
