
// simple wrapper for setTimeout

module.exports = function (time, callback) {
  return setTimeout(callback, Math.round(time));
};
