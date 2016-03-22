(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.plonk = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

var delay = _dereq_(10),
    rand = _dereq_(8),
    toNumber = _dereq_(19);

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

},{"10":10,"19":19,"8":8}],2:[function(_dereq_,module,exports){

var scale = _dereq_(9),
    metro = _dereq_(12),
    toNumber = _dereq_(19);

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

},{"12":12,"19":19,"9":9}],3:[function(_dereq_,module,exports){

var scale = _dereq_(9),
    constrain = _dereq_(5),
    metro = _dereq_(12),
    toNumber = _dereq_(19);

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

},{"12":12,"19":19,"5":5,"9":9}],4:[function(_dereq_,module,exports){

var delay = _dereq_(10),
    drunk = _dereq_(6),
    toNumber = _dereq_(19);

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

},{"10":10,"19":19,"6":6}],5:[function(_dereq_,module,exports){

var toNumber = _dereq_(19);

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

},{"19":19}],6:[function(_dereq_,module,exports){

var constrain = _dereq_(5),
    rand = _dereq_(8),
    toNumber = _dereq_(19);

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

},{"19":19,"5":5,"8":8}],7:[function(_dereq_,module,exports){

var constrain = _dereq_(5),
    toNumber = _dereq_(19);

// poor mans exponential map

module.exports = function (n) {
  n = toNumber(n, 0);
  return Math.pow(constrain(n, 0, 1), Math.E);
};

},{"19":19,"5":5}],8:[function(_dereq_,module,exports){

var toNumber = _dereq_(19);

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

},{"19":19}],9:[function(_dereq_,module,exports){

var constrain = _dereq_(5),
    toNumber = _dereq_(19);

// linear map of input value from input range to output range

module.exports = function (n, a1, a2, b1, b2) {
  n = toNumber(n, 0);
  a1 = toNumber(a1, 0);
  a2 = toNumber(a2, 1);
  b1 = toNumber(b1, 0);
  b2 = toNumber(b2, 1);
  return b1 + (constrain(n, a1, a2) - a1) * (b2 - b1) / (a2 - a1);
};

},{"19":19,"5":5}],10:[function(_dereq_,module,exports){

var defer = _dereq_(15),
    now = _dereq_(16),
    toNumber = _dereq_(19);

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

},{"15":15,"16":16,"19":19}],11:[function(_dereq_,module,exports){

var defer = _dereq_(15),
    now = _dereq_(16),
    tick = _dereq_(17),
    toNumber = _dereq_(19);

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

},{"15":15,"16":16,"17":17,"19":19}],12:[function(_dereq_,module,exports){

var defer = _dereq_(15),
    now = _dereq_(16),
    toNumber = _dereq_(19);

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

},{"15":15,"16":16,"19":19}],13:[function(_dereq_,module,exports){

var defer = _dereq_(15),
    now = _dereq_(16),
    toNumber = _dereq_(19);

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

},{"15":15,"16":16,"19":19}],14:[function(_dereq_,module,exports){

var toNumber = _dereq_(19);

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

},{"19":19}],15:[function(_dereq_,module,exports){

var Promise = _dereq_(22),
    tick = _dereq_(17);

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

},{"17":17,"22":22}],16:[function(_dereq_,module,exports){
(function (process){
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

}).call(this,_dereq_(23))
},{"23":23}],17:[function(_dereq_,module,exports){
(function (process){

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

}).call(this,_dereq_(23))
},{"23":23}],18:[function(_dereq_,module,exports){

var toNumber = _dereq_(19);

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

},{"19":19}],19:[function(_dereq_,module,exports){

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

},{}],20:[function(_dereq_,module,exports){
(function (global){
'use strict';
var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function () {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],21:[function(_dereq_,module,exports){
'use strict';
var immediate = _dereq_(20);

/* istanbul ignore next */
function INTERNAL() {}

var handlers = {};

var REJECTED = ['REJECTED'];
var FULFILLED = ['FULFILLED'];
var PENDING = ['PENDING'];

module.exports = exports = Promise;

function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.queue = [];
  this.outcome = void 0;
  if (resolver !== INTERNAL) {
    safelyResolveThenable(this, resolver);
  }
}

Promise.prototype["catch"] = function (onRejected) {
  return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
    typeof onRejected !== 'function' && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.outcome);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }
  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}
QueueItem.prototype.callFulfilled = function (value) {
  handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};

function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (e) {
      return handlers.reject(promise, e);
    }
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      handlers.resolve(promise, returnValue);
    }
  });
}

handlers.resolve = function (self, value) {
  var result = tryCatch(getThen, value);
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.outcome = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;
};
handlers.reject = function (self, error) {
  self.state = REJECTED;
  self.outcome = error;
  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;
};

function getThen(obj) {
  // Make sure we only access the accessor once as required by the spec
  var then = obj && obj.then;
  if (obj && typeof obj === 'object' && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}

function safelyResolveThenable(self, thenable) {
  // Either fulfill, reject or reject with error
  var called = false;
  function onError(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.reject(self, value);
  }

  function onSuccess(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.resolve(self, value);
  }

  function tryToUnwrap() {
    thenable(onSuccess, onError);
  }

  var result = tryCatch(tryToUnwrap);
  if (result.status === 'error') {
    onError(result.value);
  }
}

function tryCatch(func, value) {
  var out = {};
  try {
    out.value = func(value);
    out.status = 'success';
  } catch (e) {
    out.status = 'error';
    out.value = e;
  }
  return out;
}

exports.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return handlers.resolve(new this(INTERNAL), value);
}

exports.reject = reject;
function reject(reason) {
  var promise = new this(INTERNAL);
  return handlers.reject(promise, reason);
}

exports.all = all;
function all(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }
  }
}

exports.race = race;
function race(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        handlers.resolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}

},{"20":20}],22:[function(_dereq_,module,exports){
module.exports = typeof Promise === 'function' ? Promise : _dereq_(21);

},{"21":21}],23:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],24:[function(_dereq_,module,exports){

module.exports = {
  constrain: _dereq_(5),
  debounce: _dereq_(14),
  defer: _dereq_(15),
  delay: _dereq_(10),
  drunk: _dereq_(6),
  dust: _dereq_(1),
  env: _dereq_(2),
  exp: _dereq_(7),
  frames: _dereq_(11),
  metro: _dereq_(12),
  ms: _dereq_(18),
  now: _dereq_(16),
  rand: _dereq_(8),
  scale: _dereq_(9),
  sine: _dereq_(3),
  tick: _dereq_(17),
  toMilliseconds: _dereq_(18),
  toNumber: _dereq_(19),
  wait: _dereq_(13),
  walk: _dereq_(4)
};

},{"1":1,"10":10,"11":11,"12":12,"13":13,"14":14,"15":15,"16":16,"17":17,"18":18,"19":19,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9}]},{},[24])(24)
});