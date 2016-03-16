
// performance.now fallback

module.exports = (function () {
  if (typeof performance !== 'undefined' && ('now' in performance)) {
    return function () { return performance.now(); };
  } else {
    var now = (Date.now || function () { return (new Date).getTime(); }),
    offset = now();
    return function () { return now() - offset; };
  }
})();
