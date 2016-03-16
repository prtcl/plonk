
// execute the callback function with increasing speed, starting with delay

module.exports = function (delay, callback) {
  (function env (i) {
    var step = Math.floor(delay / i--);
    setTimeout(function(){
      callback && callback(step);
      if (i > 0) env(i);
    }, step);
  })(11);
};
