/*jshint -W058 */

// performance.now fallback

module.exports = (function () {
  if (typeof performance !== 'undefined' && ('now' in performance)) {
    return function () { return performance.now(); };
  } else if (typeof process === 'object' && process.toString() === '[object process]') {
    var offset = now();
    function now () {
      var hr = process.hrtime();
      return hr[0] * 1e9 + hr[1];
    }
    return function () { return (now() - offset) / 1e6; };
  } else {
    var now = (Date.now || function () { return (new Date).getTime(); }),
        offset = now();
    return function () { return now() - offset; };
  }
})();
