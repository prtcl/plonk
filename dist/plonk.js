(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.plonk = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var delay = require(11),
    rand = require(9),
    toNumber = require(20);

// timer function where the interval jitters between min and max milliseconds

module.exports = function (min, max, callback) {
  min = toNumber(min, 10);
  max = toNumber(max, 100);
  if (arguments.length <= 2) {
    max = min;
    min = 0;
  }
  return delay(rand(min, max), function (interval, i, stop) {
    callback && callback(interval, i, stop);
    return rand(min, max);
  });
};

},{"11":11,"20":20,"9":9}],2:[function(require,module,exports){

var scale = require(10),
    metro = require(13),
    toNumber = require(20);

// linear interpolation of value to target over time

module.exports = function (value, target, time, callback) {
  value = toNumber(value, 0);
  target = toNumber(target, 1);
  time = toNumber(time, 100);
  var elapsed = 0;
  return metro(4, function (interval, i, stop) {
    if (elapsed >= time) stop(target);
    var interpolated = scale(elapsed, 0, time, value, target);
    elapsed += interval;
    callback && callback(interpolated);
    return interpolated;
  });
};

},{"10":10,"13":13,"20":20}],3:[function(require,module,exports){

var scale = require(10),
    constrain = require(6),
    metro = require(13),
    toNumber = require(20);

// a sine wave LFO with cycle time passed as ms

var period = (Math.PI * 2) - 0.0001;

module.exports = function (time, callback) {
  time = toNumber(time, 0);
  var cycle = 0, elapsed = 0, progress;
  return metro(4, function (interval, i, stop) {
    var rad = scale(cycle, 0, time, 0, period);
    if (cycle >= time) {
      cycle = 0;
    } else {
      cycle += interval;
    }
    elapsed += interval;
    var sin = constrain(Math.sin(rad), -1, 1);
    callback && (progress = callback(sin, cycle, elapsed, stop));
    time = toNumber(progress, time);
    return sin;
  });
};

},{"10":10,"13":13,"20":20,"6":6}],4:[function(require,module,exports){

var delay = require(11),
    drunk = require(7),
    toNumber = require(20);

// timer function where the interval is decided by a "drunk walk" between min and max milliseconds

module.exports = function (min, max, callback) {
  min = toNumber(min, 10);
  max = toNumber(max, 100);
  if (arguments.length <= 2) {
    max = min;
    min = 0;
  }
  var d = drunk(min, max), progress;
  return delay(d(), function (time, i, stop) {
    callback && (progress = callback(time, i, stop));
    return d(progress);
  });
};

},{"11":11,"20":20,"7":7}],5:[function(require,module,exports){

module.exports = {
  constrain: require(6),
  debounce: require(15),
  defer: require(16),
  delay: require(11),
  drunk: require(7),
  dust: require(1),
  env: require(2),
  exp: require(8),
  frames: require(12),
  metro: require(13),
  ms: require(19),
  now: require(17),
  rand: require(9),
  scale: require(10),
  sine: require(3),
  tick: require(18),
  toMilliseconds: require(19),
  toNumber: require(20),
  wait: require(14),
  walk: require(4)
};

},{"1":1,"10":10,"11":11,"12":12,"13":13,"14":14,"15":15,"16":16,"17":17,"18":18,"19":19,"2":2,"20":20,"3":3,"4":4,"6":6,"7":7,"8":8,"9":9}],6:[function(require,module,exports){

var toNumber = require(20);

// constrain value between min and max

module.exports = function (n, min, max) {
  n = toNumber(n, 0);
  min = toNumber(min, 0);
  max = toNumber(max, 1);
  if (arguments.length <= 2) {
    max = min || 1;
    min = 0;
  }
  return Math.min(Math.max(n, min), max);
};

},{"20":20}],7:[function(require,module,exports){

var constrain = require(6),
    rand = require(9),
    toNumber = require(20);

// returns a function that performs a "drunk walk" between min and max

module.exports = function (min, max, step) {
  min = toNumber(min, 0);
  max = toNumber(max, 1);
  step = constrain(toNumber(step, 0.1), 0, 1);
  if (arguments.length <= 1) {
    max = min || 1;
    min = 0;
  }
  var n = rand(min, max);
  return function (s) {
    step = toNumber(s, step);
    n = constrain(n + (max * rand(-1, 1) * step), min, max);
    return n;
  };
};

},{"20":20,"6":6,"9":9}],8:[function(require,module,exports){

var constrain = require(6),
    toNumber = require(20);

// poor mans exponential map

module.exports = function (n) {
  n = toNumber(n, 0);
  return Math.pow(constrain(n, 0, 1), Math.E);
};

},{"20":20,"6":6}],9:[function(require,module,exports){

var toNumber = require(20);

// just returns a random number between min and max

module.exports = function (min, max) {
  if (arguments.length <= 1) {
    max = toNumber(min, 1);
    min = 0;
  } else {
    min = toNumber(min, 0);
    max = toNumber(max, 1);
  }
  return Math.random() * (max - min) + min;
};

},{"20":20}],10:[function(require,module,exports){

var constrain = require(6),
    toNumber = require(20);

// linear map of input value from input range to output range

module.exports = function (n, a1, a2, b1, b2) {
  n = toNumber(n, 0);
  a1 = toNumber(a1, 0);
  a2 = toNumber(a2, 1);
  b1 = toNumber(b1, 0);
  b2 = toNumber(b2, 1);
  return b1 + (constrain(n, a1, a2) - a1) * (b2 - b1) / (a2 - a1);
};

},{"20":20,"6":6}],11:[function(require,module,exports){

var defer = require(16),
    now = require(17),
    toNumber = require(20);

// timer function where the next interval is decided by the return value of the tick callback
// the tick interval time as reported by performance.now() is passed into the notify callback

module.exports = function (time, callback) {
  time = toNumber(time, 10);
  var def = defer(), prev = now(), cont = true, i = 0, elapsed = 0, interval, progress;
  (function next () {
    setTimeout(function() {
      interval = now() - prev;
      elapsed += interval;
      prev = now();
      callback && (progress = callback(interval, i++, stop));
      time = toNumber(progress, time);
      def.notify(interval);
      if (cont === true) next();
    }, time);
  })();
  function stop () {
    cont = false;
    def.resolve(elapsed);
  }
  return def.promise;
};

},{"16":16,"17":17,"20":20}],12:[function(require,module,exports){

var defer = require(16),
    now = require(17),
    tick = require(18),
    toNumber = require(20);

// animation loop and requestAnimationFrame polyfill with stop function

var frameHandler = (function () {
  var frame;
  if (typeof window === 'object') {
    var availableFrames = [
      window.requestAnimationFrame,
      window.webkitRequestAnimationFrame,
      window.mozRequestAnimationFrame,
      window.msRequestAnimationFrame,
      window.oRequestAnimationFrame
    ];
    for (var i = 0; i < availableFrames.length; i++) {
      frame || (frame = (availableFrames[i] ? availableFrames[i] : null));
      if (frame) break;
    }
  }
  if (!frame) frame = function (callback) { setTimeout(callback, 1000 / 60); };
  return frame;
})();

module.exports = function (frameRate, callback) {
  if (arguments.length === 2) {
    frameRate = toNumber(frameRate, 60);
  } else if (arguments.length === 1) {
    callback = frameRate;
    frameRate = 60;
  }
  if (!callback || typeof callback !== 'function') {
    throw new Error('plonk.frames requires a callback as argument');
  }
  var def = defer(), prev = now(), elapsed = 0, i = 0, cont = true, interval, progress;
  frameHandler(function next () {
    interval = now() - prev;
    if (elapsed && interval <= ((1000 / frameRate) - 5)) {
      return tick(frameHandler(next));
    }
    prev = now();
    elapsed += interval;
    callback && (progress = callback(interval, elapsed, i++, stop));
    frameRate = toNumber(progress, frameRate);
    if (frameRate === 0) stop();
    def.notify(interval);
    if (cont === true) frameHandler(next);
  });
  function stop () {
    cont = false;
    def.resolve(elapsed);
  }
  return def.promise;
};

},{"16":16,"17":17,"18":18,"20":20}],13:[function(require,module,exports){

var defer = require(16),
    now = require(17),
    toNumber = require(20);

// wrapper for setInterval with stop function
// returns a promise that is resolved when the timer stops
// the tick interval time as reported by performance.now() is passed into the tick callback
// the promise is notified on every tick with the tick function's return value
// and a value passed to stop(value) will be passed to the promise resolve method

module.exports = function (time, callback) {
  time = toNumber(time, 4);
  var def = defer(), i = 0, prev = now(), interval, progress;
  var timer = setInterval(function () {
    interval = now() - prev;
    prev = now();
    callback && (progress = callback(interval, i++, stop));
    def.notify(progress);
  }, time);
  function stop (val) {
    clearTimeout(timer);
    def.resolve(val);
  }
  return def.promise;
};

},{"16":16,"17":17,"20":20}],14:[function(require,module,exports){

var defer = require(16),
    now = require(17),
    toNumber = require(20);

// simple wrapper for setTimeout that returns a promise
// execution time as reported by performance.now is passed to the resolve callback

module.exports = function (time, callback) {
  time = toNumber(time, 0);
  var def = defer(), start = now();
  setTimeout(function () {
    var end = now() - start;
    callback && callback(end);
    def.resolve(end);
  }, time);
  return def.promise;
};

},{"16":16,"17":17,"20":20}],15:[function(require,module,exports){

var toNumber = require(20);

// returns a function that will only be executed once, N milliseconds after the last call

module.exports = function (time, callback) {
  if (arguments.length === 2) {
    time = toNumber(time, 100);
  } else if (arguments.length === 1) {
    callback = time;
    time = 100;
  }
  var timer;
  return function () {
    timer && clearTimeout(timer);
    timer = setTimeout(callback, time);
  };
};

},{"20":20}],16:[function(require,module,exports){

var Promise = require(23),
    tick = require(18);

module.exports = function () {
  var _progressHandlers = [], _resolveHandler, _rejectHandler,
      _isResolved = false;

  var defer = {
    resolve: function (val) {
      if (_isResolved) return;
      _resolveHandler && _resolveHandler(val);
      _isResolved = true;
    },
    reject: function (val) {
      if (_isResolved) return;
      _rejectHandler && _rejectHandler(val);
      _isResolved = true;
    },
    notify: function (val) {
      if (_isResolved) return;
      tick(function () {
        for (var i = 0; i < _progressHandlers.length; i++) {
          _progressHandlers[i](val);
        }
      });
    },
    promise: new Promise(function (resolve, reject) {
      _resolveHandler = resolve;
      _rejectHandler = reject;
    })
  };

  defer.promise.progress = function (callback) {
    if (_isResolved) return defer.promise;
    if (typeof callback === 'function') {
      _progressHandlers.push(callback);
    }
    return defer.promise;
  };

  return defer;
};

},{"18":18,"23":23}],17:[function(require,module,exports){
/*jshint -W058 */

// performance.now fallback

module.exports = (function () {
  var offset, now;
  if (typeof performance !== 'undefined' && ('now' in performance)) {
    return function () { return performance.now(); };
  } else if (typeof process === 'object' && process.toString() === '[object process]') {
    now = function () {
      var hr = process.hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    offset = now();
    return function () { return (now() - offset) / 1e6; };
  } else {
    now = (Date.now || function () { return (new Date).getTime(); });
    offset = now();
    return function () { return now() - offset; };
  }
})();

},{}],18:[function(require,module,exports){

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
  if (typeof task !== 'function') return;
  tasks.push(task);
  if (!isRunning) {
    isRunning = true;
    nextTickHandler();
  }
};

},{}],19:[function(require,module,exports){

var toNumber = require(20);

var formats = ['hz', 'ms', 's', 'm'];

module.exports = function (val, format, def) {
  format || (format = 'ms');
  var ms = toNumber(def, 0);
  if (typeof val === 'string') {
    val = val.toLowerCase();
    for (var i = 0; i < formats.length; i++) {
      if (val.indexOf(formats[i]) !== -1) {
        format = formats[i];
        val = val.replace(' ', '').replace(formats[i], '');
        break;
      }
    }
    val = +val;
  }
  if (val === null || typeof val === 'undefined') {
    return ms;
  }
  if (isNaN(val)) return ms;
  if (format === 'hz') {
    ms = (1 / val) * 1000;
  } else if (format === 'ms') {
    ms = val;
  } else if (format === 's') {
    ms = val * 1000;
  } else if (format === 'm') {
    ms = val * 60 * 1000;
  }
  return ms;
};

},{"20":20}],20:[function(require,module,exports){

module.exports = function (n, def) {
  def || (def = 0);
  if (n === null || typeof n === 'undefined') {
    return def;
  }
  if (typeof n === 'string') {
    n = +n;
  }
  if (isNaN(n)) return def;
  return n;
};

},{}],21:[function(require,module,exports){
"use strict";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

},{}],22:[function(require,module,exports){
'use strict';

var asap = require(21);

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('not a function');
  }
  this._45 = 0;
  this._81 = 0;
  this._65 = null;
  this._54 = null;
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._10 = null;
Promise._97 = null;
Promise._61 = noop;

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
};
function handle(self, deferred) {
  while (self._81 === 3) {
    self = self._65;
  }
  if (Promise._10) {
    Promise._10(self);
  }
  if (self._81 === 0) {
    if (self._45 === 0) {
      self._45 = 1;
      self._54 = deferred;
      return;
    }
    if (self._45 === 1) {
      self._45 = 2;
      self._54 = [self._54, deferred];
      return;
    }
    self._54.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  asap(function() {
    var cb = self._81 === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._81 === 1) {
        resolve(deferred.promise, self._65);
      } else {
        reject(deferred.promise, self._65);
      }
      return;
    }
    var ret = tryCallOne(cb, self._65);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._81 = 3;
      self._65 = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._81 = 1;
  self._65 = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._81 = 2;
  self._65 = newValue;
  if (Promise._97) {
    Promise._97(self, newValue);
  }
  finale(self);
}
function finale(self) {
  if (self._45 === 1) {
    handle(self, self._54);
    self._54 = null;
  }
  if (self._45 === 2) {
    for (var i = 0; i < self._54.length; i++) {
      handle(self, self._54[i]);
    }
    self._54 = null;
  }
}

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  })
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}

},{"21":21}],23:[function(require,module,exports){
'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require(22);

module.exports = Promise;

/* Static Functions */

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._61);
  p._81 = 1;
  p._65 = value;
  return p;
}
Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._81 === 3) {
            val = val._65;
          }
          if (val._81 === 1) return res(i, val._65);
          if (val._81 === 2) reject(val._65);
          val.then(function (val) {
            res(i, val);
          }, reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

},{"22":22}]},{},[5])(5)
});