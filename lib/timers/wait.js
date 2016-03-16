
// simple wrapper for setTimeout

module.exports = function (time, callback) {
  return setTimeout(context, Math.round(time));
};
