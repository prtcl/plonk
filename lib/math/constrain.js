
// constrain value between min and max

module.exports = function (n, min, max) {
  min || (min = 0);
  if (arguments.length === 2) {
    max = min;
    min = 0;
  }
  return Math.min(Math.max(n, min), max);
};
