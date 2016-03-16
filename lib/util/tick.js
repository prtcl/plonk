
// poor mans nextTick polyfill

var nextTick;
if (typeof process === 'object' && 'nextTick' in process) {
  nextTick = function (callback) {
    process.nextTick(callback);
  };
} else if (window && 'setImmediate' in window) {
  nextTick = function (callback) {
    setImmediate(callback);
  };
} else if (window && 'postMessage' in window) {
  nextTick = (function(){
    var callbacks = {};
    window.addEventListener('message', function (e) {
      var id = e.data;
      if (e.source !== window || !(id in callbacks)) return;
      callbacks[id]();
      delete callbacks[id];
    }, true);
    return function (callback) {
      var id = 'tick-' + Math.random();
      callbacks[id] = callback;
      postMessage(id, '*');
    };
  })();
} else {
  nextTick = function (callback) {
    setTimeout(callback, 0);
  };
}

module.exports = nextTick;
