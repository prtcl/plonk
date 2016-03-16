
// just returns a random number between min and max

module.exports = function (min, max) {
  return Math.random() * (max - min) + min;
};
