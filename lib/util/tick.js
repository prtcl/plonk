
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

/**
 * `nextTick` polyfill that chooses the fastest method for the current environment from `process.nextTick`, `setImmediate`, `MessageChannel`, or `setTimeout`, in that order.
 * @static
 * @memberof plonk
 * @name tick
 * @param {function} callback
 * @example
 * plonk.tick(function () {
 *   console.log(1);
 * });
 * console.log(0);
 * // => 0
 * // => 1
 */
module.exports = function (task) {
  if (typeof task !== 'function') return;
  tasks.push(task);
  if (!isRunning) {
    isRunning = true;
    nextTickHandler();
  }
};
