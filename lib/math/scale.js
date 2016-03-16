
// linear map of value from input range to output range

module.exports = function (value, minIn, maxIn, minOut, maxOut) {
  return minOut + (value - minIn) * (maxOut - minOut) / (maxIn - minIn);
};
