
// poor mans nextTick polyfill

var tasks = [],
    isRunning = false,
    nextTickHandler;

function runTaskQueue () {
  try {
    while (tasks.length) {
      tasks.shift()();
    }
  } catch (err) {
    setTimeout(function () { throw err; }, 0);
  } finally {
    isRunning = false;
  }
}

if (typeof process === 'object' && process.toString() === '[object process]' && process.nextTick) {
  // make sure that we're in the real node environment, and then use process.nextTick
  nextTickHandler = function () {
    process.nextTick(runTaskQueue);
  };
} else if (typeof setImmediate === 'function') {
  // setImmediate is still faster, or at least less hacky, in IE
  nextTickHandler = function () {
    setImmediate(runTaskQueue);
  };
} else if (typeof MessageChannel !== 'undefined') {
  // use MessageChannel
  var channel = new MessageChannel();
  channel.port1.onmessage = runTaskQueue;
  nextTickHandler = function () {
    channel.port2.postMessage(0);
  };
} else {
  // back to basics
  nextTickHandler = function () {
    setTimeout(runTaskQueue, 0);
  };
}

module.exports = function (task) {
  tasks.push(task);
  if (!isRunning) {
    isRunning = true;
    nextTickHandler();
  }
};
