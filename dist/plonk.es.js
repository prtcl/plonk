/*
 * plonk - v1.1.0
 * (c) Cory O'Brien <cory@prtcl.cc>
 * License MIT
 */

/*
 * Includes:
 *  asap https://github.com/kriskowal/asap
 *  promise https://github.com/then/promise
 */

// Basic number formatter
// Passes value unaltered if it is a Number, converts to Number if it's a coercible String, or returns default if null, undefined, or NaN.

function toNumber(n) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (n === null || typeof n === 'undefined') {
    return def;
  }
  if (typeof n === 'string') {
    n = +n;
  }
  if (isNaN(n)) return def;
  if (typeof n !== 'number') {
    return def;
  }
  return n;
}

/**
 * Constrains an input `value` to `min...max` range.
 * @static
 * @memberof plonk
 * @name clamp
 * @param {number} value
 * @param {number} [min=max]
 * @param {number} [max=1]
 * @returns {number} `value` constrained to `min...max` range.
 * @example
 * plonk.clamp(Math.random());
 * // => 0.13917264847745225
 * plonk.clamp(Math.random() * 5 - 2.5, -1, 1);
 * // => 1
 */
function clamp(n, min, max) {
  n = toNumber(n, 0);
  min = toNumber(min, 0);
  max = toNumber(max, 1);
  if (arguments.length <= 2) {
    max = min || 1;
    min = 0;
  }
  return Math.min(Math.max(n, min), max);
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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
var browserRaw = rawAsap$1;
function rawAsap$1(task) {
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
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof commonjsGlobal !== "undefined" ? commonjsGlobal : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

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
rawAsap$1.requestFlush = requestFlush;

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
rawAsap$1.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

// rawAsap provides everything we need except exception management.
var rawAsap = browserRaw;
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
var browserAsap = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};

var asap$2 = browserRaw;

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

var core = Promise$3;

function Promise$3(fn) {
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
Promise$3._10 = null;
Promise$3._97 = null;
Promise$3._61 = noop;

Promise$3.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise$3) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise$3(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise$3(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
}
function handle(self, deferred) {
  while (self._81 === 3) {
    self = self._65;
  }
  if (Promise$3._10) {
    Promise$3._10(self);
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
  asap$2(function() {
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
      newValue instanceof Promise$3
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
  if (Promise$3._97) {
    Promise$3._97(self, newValue);
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
  });
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise$1 = core;

var es6Extensions = Promise$1;

/* Static Functions */

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise$1(Promise$1._61);
  p._81 = 1;
  p._65 = value;
  return p;
}
Promise$1.resolve = function (value) {
  if (value instanceof Promise$1) return value;

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
        return new Promise$1(then.bind(value));
      }
    } catch (ex) {
      return new Promise$1(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise$1.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new Promise$1(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise$1 && val.then === Promise$1.prototype.then) {
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
            var p = new Promise$1(then.bind(val));
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

Promise$1.reject = function (value) {
  return new Promise$1(function (resolve, reject) {
    reject(value);
  });
};

Promise$1.race = function (values) {
  return new Promise$1(function (resolve, reject) {
    values.forEach(function(value){
      Promise$1.resolve(value).then(resolve, reject);
    });
  });
};

/* Prototype Methods */

Promise$1.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

function noop$1() {}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

// A basic Deferred class that is used for all promises internally
// It's exposed as plonk.defer, but not documented, since plonk is not trying to be a promise library

function defer() {
  return new Deferred();
}

var Deferred = function () {
  function Deferred() {
    var _this = this;

    classCallCheck(this, Deferred);

    this._isResolved = false;
    this._isRejected = false;
    this._resolveHandler = noop$1;
    this._rejectHandler = noop$1;

    this.promise = new _Promise(function (resolve, reject) {
      _this._resolveHandler = resolve;
      _this._rejectHandler = reject;
    });
  }

  createClass(Deferred, [{
    key: 'resolve',
    value: function resolve(val) {
      if (this._isResolved) return;
      this._isResolved = true;
      this._resolveHandler(val);
    }
  }, {
    key: 'reject',
    value: function reject(val) {
      if (this._isRejected) return;
      this._isRejected = true;
      this._rejectHandler(val);
    }
  }, {
    key: 'notify',
    value: function notify(val) {
      if (this._isResolved || this._isRejected) return;
      _notify(this.promise, val);
    }
  }]);
  return Deferred;
}();

var _Promise = function (_Promise2) {
  inherits(_Promise, _Promise2);

  function _Promise() {
    var _ref;

    classCallCheck(this, _Promise);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this2 = possibleConstructorReturn(this, (_ref = _Promise.__proto__ || Object.getPrototypeOf(_Promise)).call.apply(_ref, [this].concat(args)));

    _this2._progressHandlers = [];
    return _this2;
  }

  createClass(_Promise, [{
    key: 'progress',
    value: function progress(callback) {
      this._progressHandlers || (this._progressHandlers = []);
      if (typeof callback === 'function') {
        this._progressHandlers.push(callback);
      }
      return this;
    }
  }, {
    key: 'then',
    value: function then(resolver) {
      if (typeof resolver !== 'function') {
        return get(_Promise.prototype.__proto__ || Object.getPrototypeOf(_Promise.prototype), 'then', this).call(this, resolver);
      }

      var res = get(_Promise.prototype.__proto__ || Object.getPrototypeOf(_Promise.prototype), 'then', this).call(this, function () {
        var ret = resolver.apply(undefined, arguments);

        if (ret instanceof _Promise) {
          ret.progress(function (val) {
            _notify(promise, val);
          });
        }

        return ret;
      });

      var promise = new _Promise(function (resolve, reject) {
        res.then(resolve, reject);
      });

      return promise;
    }
  }]);
  return _Promise;
}(es6Extensions);

function _notify(promise, val) {
  if (!promise._progressHandlers) return;
  browserAsap(function () {
    promise._progressHandlers.forEach(function (fn) {
      fn(val);
    });
  });
}

/**
 * High resolution timestamp that uses `performance.now()` in the browser, or `process.hrtime()` in Node. Provides a Date-based fallback otherwise.
 * @static
 * @memberof plonk
 * @name now
 * @returns {number} elapsed time in milliseconds
 * @example
 * plonk.now();
 * // => 2034.65879
 */
function now() {
  return performanceNowHandler();
}

// try to choose the best method for producing a performance.now() timestamp
var performanceNowHandler = function () {

  if (typeof performance !== 'undefined' && 'now' in performance) {

    return function () {
      return performance.now();
    };
  } else if ((typeof process === 'undefined' ? 'undefined' : _typeof(process)) === 'object' && process.toString() === '[object process]') {

    return function () {
      function n() {
        var hr = process.hrtime();
        return hr[0] * 1e9 + hr[1];
      }
      var offset = n();
      return function () {
        return (n() - offset) / 1e6;
      };
    }();
  }

  return function () {
    var offset = Date.now();
    return function () {
      return Date.now() - offset;
    };
  }();
}();

// Generic high-resolution timer class that forms that basis for all other timers

var Timer = function () {
  function Timer(time) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop$1;
    classCallCheck(this, Timer);

    this._tickHandler = tickHandler;
    this._timeOffset = 0;
    this.isRunning = false;
    this.time = toNumber(time, 1000 / 60);
    this.initialTime = this.time;
    this.callback = callback;
    this.reset();
  }

  createClass(Timer, [{
    key: 'run',
    value: function run() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.prev = now();
      this.tick();
      return this;
    }
  }, {
    key: 'tick',
    value: function tick() {
      var _this = this;

      if (!this.isRunning) return;
      this._tickHandler(function () {
        if (_this.iterations === 0) {
          _this.callback(0, 0, 0);
          _this.prev = now();
          _this.iterations = 1;
          return _this.tick();
        }
        _this.interval = now() - _this.prev;
        if (_this.interval <= _this.time + _this._timeOffset) {
          return _this.tick();
        }
        _this.elapsed += _this.interval;
        _this.callback(_this.interval, _this.iterations, _this.elapsed);
        if (_this.isRunning) {
          _this.prev = now();
          _this.iterations += 1;
          _this.tick();
        }
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      var elapsed = this.elapsed;
      this.isRunning = false;
      this.reset();
      return elapsed;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.elapsed = 0;
      this.iterations = 0;
      this.interval = 0;
      this.prev = 0;
      this.time = this.initialTime;
      return this;
    }
  }]);
  return Timer;
}();

function tickHandler() {
  var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop$1;

  setTimeout(callback, 0);
}

/**
 * A variable timer loop where the tick interval is decided by the return value of `callback`. If none is provided, the previous/intial value is used. `time` sets the intial interval value.
 *
 * The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), `elapsed` (total run time), and a `stop()` function.
 * @static
 * @memberof plonk
 * @name delay
 * @param {number} time
 * @param {function} callback
 * @returns {promise}
 * @example
 * var t = 100;
 * plonk.delay(t, function (interval, i, elapsed, stop) {
 *   if (i == 10) {
 *     return stop();
 *   }
 *   return (t = t * 1.15);
 * })
 * .progress(function (interval) {
 *   console.log(interval);
 *   // => 10
 *   //  115.000208
 *   //  132.25017300000002
 *   //  152.087796
 *   //  174.90065899999996
 *   //    ...
 * })
 * .then(function (elapased) {
 *   console.log(elapased);
 *   // => 2334.929456
 * });
 */
function delay(time) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop$1;

  var def = new Deferred();

  var timer = new Timer(time, function () {
    var progress = callback(timer.interval, timer.iterations, timer.elapsed, stop);
    timer.time = time = toNumber(progress, time);

    def.notify(timer.interval);
  });
  timer.run();

  function stop() {
    def.resolve(timer.elapsed);
    timer.stop();
  }

  return def.promise;
}

/**
 * Random number in `min...max` range.
 * @static
 * @memberof plonk
 * @name rand
 * @param {number} [min=max]
 * @param {number} [max=1]
 * @returns {number} random number
 * @example
 * plonk.rand(-1, 1);
 * // => -0.3230291483923793
 */
function rand(min, max) {
  if (arguments.length <= 1) {
    max = toNumber(min, 1);
    min = 0;
  } else {
    min = toNumber(min, 0);
    max = toNumber(max, 1);
  }
  return Math.random() * (max - min) + min;
}

/**
 * Factory that returns a [drunk walk](https://en.wikipedia.org/wiki/Random_walk) random function that walks between `min...max`.
 * @static
 * @memberof plonk
 * @name drunk
 * @param {number} [min=max]
 * @param {number} [max=1]
 * @param {number} [step=0.1]
 * @returns {function} for drunk walking.
 * @example
 * var drunk = plonk.drunk(-1, 1);
 * for (var i = 0; i < 100; i++) {
 *   console.log(drunk());
 *   // => 0.9912726839073003
 *   //    0.9402238005306572
 *   //    0.8469231501687319
 *   //    0.9363016556948425
 *   //    0.9024078783579172
 *   //    ...
 * }
 */
function drunk(min, max, step) {
  min = toNumber(min, 0);
  max = toNumber(max, 1);
  step = clamp(toNumber(step, 0.1), 0, 1);
  if (arguments.length <= 1) {
    max = min || 1;
    min = 0;
  }
  var n = rand(min, max);
  return function (s) {
    step = toNumber(s, step);
    n = clamp(n + max * rand(-1, 1) * step, min, max);
    return n;
  };
}

/**
 * Timer function where the tick interval jitters between `min...max` milliseconds.
 *
 * The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), `elapsed` (total run time), and a `stop()` function.
 * @static
 * @memberof plonk
 * @name dust
 * @param {number} min
 * @param {number} max
 * @param {function} [callback=noop]
 * @returns {promise}
 * @example
 * plonk.dust(30, 100, function (interval, i, elapsed, stop) {
 *   if (i === 10) {
 *     stop();
 *   }
 * })
 * .progress(function (interval) {
 *   console.log(interval);
 *   // => 74.155273
 *   //    53.998158000000004
 *   //    99.259871
 *   //    53.27543200000002
 *   //    77.56419299999999
 *   //    ...
 * })
 * .then(function (elapsed) {
 *   console.log(elapsed);
 *   // => 663.0071679999999
 * });
 */
function dust(min, max) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop$1;

  min = toNumber(min, 10);
  max = toNumber(max, 100);

  if (arguments.length <= 2) {
    max = min;
    min = 0;
  }

  return delay(rand(min, max), function (interval, i, elapsed, stop) {
    callback(interval, i, elapsed, stop);
    return rand(min, max);
  });
}

/**
 * A repeating timer loop (like setInterval) where `time` is the tick interval in milliseconds.
 *
 * The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), `elapsed` (total run time), and a `stop()` function.
 *
 * Also, the `callback` return value is passed to the `.progress()` handler, making it trivial to use `metro` to compose time-based interpolations and modulators.
 *
 * When `stop(value)` is called, the returned promise is resolved with `value`.
 * @static
 * @memberof plonk
 * @name metro
 * @param {number} time
 * @param {function} [callback=noop]
 * @returns {promise}
 * @example
 * plonk.metro(100, function (interval, i, elapsed, stop) {
 *   console.log(interval);
 *   // => 100.00048099999992
 *   var n = Math.random();
 *   if (i === 10) {
 *     return stop(n);
 *   }
 *   return n;
 * })
 * .progress(function (n) {
 *   console.log(n);
 *   // => 0.6465891992386279
 *   //    0.4153539338224437
 *   //    0.17397237631722784
 *   //    0.6499483881555588
 *   //    0.664554645336491
 *   // ...
 * })
 * .then(function (n) {
 *   console.log(n);
 *   // => 0.7674513910120222
 * });
 */
function metro(time) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop$1;

  var def = new Deferred();

  var timer = new Timer(time, function () {
    var progress = callback(timer.interval, timer.iterations, timer.elapsed, stop);
    def.notify(progress);
  });
  timer.run();

  function stop(val) {
    def.resolve(val);
    timer.stop();
  }

  return def.promise;
}

/**
 * Linear map of `value` in `minIn...maxIn` range to `minOut...maxOut` range.
 * @static
 * @memberof plonk
 * @name scale
 * @param {number} value
 * @param {number} minIn
 * @param {number} maxIn
 * @param {number} minOut
 * @param {number} maxOut
 * @returns {number} `value` mapped to `minOut...maxOut` range.
 * @example
 * [-1, -0.5, 0, 0.5, 1].forEach(function (n) {
 *   plonk.scale(n, -1, 1, 33, 500);
 *   // => 33
 *   //    149.75
 *   //    266.5
 *   //    383.25
 *   //    500
 * });
 */
function scale(n, a1, a2, b1, b2) {
  n = toNumber(n, 0);
  a1 = toNumber(a1, 0);
  a2 = toNumber(a2, 1);
  b1 = toNumber(b1, 0);
  b2 = toNumber(b2, 1);
  return b1 + (clamp(n, a1, a2) - a1) * (b2 - b1) / (a2 - a1);
}

/**
 * An envelope that provides linear interpolation of `value` to `target` over `time`. The `callback` function is entirely optional, as it receives the same value as `.progress()`.
 *
 * Note that due to the inacurate nature of timers in JavaScript, very fast (<= 50ms) `time` values do not provide reliable results.
 * @static
 * @memberof plonk
 * @name env
 * @param {number} value
 * @param {number} target
 * @param {number} time
 * @param {function} [callback=noop]
 * @returns {promise}
 * @example
 * plonk.env(-1, 1, 100)
 *   .progress(function (val) {
 *     console.log(val);
 *     // => -1
 *     //    -0.6666658999999999
 *     //    -0.33333203999999994
 *     //    0.0000022800000001321763
 *     //    0.33333864
 *     //    ...
 *   })
 *   .then(function (val) {
 *     console.log(val);
 *     // => 1
 *   });
 */
function env(value, target, time) {
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop$1;

  value = toNumber(value, 0);
  target = toNumber(target, 1);
  time = toNumber(time, 100);

  return metro(1000 / 60, function (interval, i, elapsed, stop) {
    if (elapsed >= time) {
      stop(target);
    }

    var interpolated = scale(elapsed, 0, time, value, target);
    callback(interpolated);

    return interpolated;
  });
}

/**
 * An exponential map of `value` in `0...1` range by [Euler's number](https://en.wikipedia.org/wiki/E_(mathematical_constant)). This makes a nice natural curve, suitable for making smooth transitions for things like audio gain, distance, and decay values.
 * @static
 * @memberof plonk
 * @name exp
 * @param {number} value
 * @returns {number} `value` remmaped to exponential curve
 * @example
 * [0, 0.25, 0.5, 0.75, 1].forEach(function (n) {
 *   plonk.exp(n);
 *   // => 0
 *   //    0.023090389875362178
 *   //    0.15195522325791297
 *   //    0.45748968090533415
 *   //    1
 * });
 */
function exp(n) {
  n = toNumber(n, 0);
  return Math.pow(clamp(n, 0, 1), Math.E);
}

/**
 * Animation loop and [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) polyfill with a little extra sugar.
 *
 * If `frameRate` is passed, the loop iteration time is throttled to `1000ms / frameRate`. Also differs from the native API in that the `callback` function receives `interval` (time since the previous frame), `i` (number of frames), `elapsed` (total running time), and a `stop()` function.
 *
 * When `stop()` is called, the returned promise is resolved with the `elapsed` value.
 * @static
 * @memberof plonk
 * @name frames
 * @param {number} [frameRate=60]
 * @param {function} callback
 * @returns {promise}
 * @example
 * plonk.frames(60, function (interval, i, elapsed, stop) {
 *   console.log(interval);
 *   // => 16.723718000000005
 *   if (someCondition) {
 *     // we can change the target framerate by return value;
 *     return 30;
 *   } else if (i === 10) {
 *     stop();
 *   }
 * })
 * .then(function (elapsed) {
 *   console.log(elapsed);
 *   // => 233.34382600000004
 * });
 */
function frames(frameRate) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop$1;


  if (arguments.length === 2) {
    frameRate = clamp(toNumber(frameRate, 60), 1, 60);
  } else if (arguments.length === 1) {
    callback = frameRate || callback;
    frameRate = 60;
  }

  var def = new Deferred();

  var timer = new Frames(1000 / frameRate, function () {
    var progress = callback(timer.interval, timer.iterations, timer.elapsed, stop);

    if (typeof progress === 'number') {
      frameRate = clamp(toNumber(progress, frameRate), 0, 60);
      if (frameRate === 0) {
        stop();
      } else {
        timer.time = 1000 / frameRate;
      }
    }

    def.notify(timer.interval);
  });
  timer.run();

  function stop() {
    def.resolve(timer.elapsed);
    timer.stop();
  }

  return def.promise;
}

var Frames = function (_Timer) {
  inherits(Frames, _Timer);

  function Frames(time) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop$1;
    classCallCheck(this, Frames);

    var _this = possibleConstructorReturn(this, (Frames.__proto__ || Object.getPrototypeOf(Frames)).call(this, time, callback));

    _this._tickHandler = frameHandler;
    _this._timeOffset = -5;
    return _this;
  }

  return Frames;
}(Timer);

var frameHandler = function () {

  var frame;

  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
    var availableFrames = [window.requestAnimationFrame, window.webkitRequestAnimationFrame, window.mozRequestAnimationFrame];

    availableFrames.forEach(function (fn) {
      if (frame) return;
      if (typeof fn === 'function') {
        frame = fn.bind(window);
      }
    });
  }

  if (!frame) {
    return function () {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop$1;

      setTimeout(callback, 0);
    };
  }

  return frame;
}();

var FORMAT_IDENTIFIERS = ['fps', 'hz', 'ms', 's', 'm'];

/**
 * Number format converter that takes a variety of input time values and returns the equivalent millisecond values.
 *
 * Format options are `ms` (pass input to output), `s` (convert from seconds), `m` (convert from minutes), `hz` (convert from 1 period of hertz), and `fps` (convert to frames per second).
 *
 * `default` is returned if `value` is null, undefined, or NaN.
 * @static
 * @memberof plonk
 * @name ms
 * @param {number} value
 * @param {String} [format=ms]
 * @param {number} [default=0]
 * @returns {number} `value` formatted to milliseconds.
 * @example
 * plonk.ms('2s');
 * // => 2000
 * plonk.ms('30hz');
 * // => 33.333333333333336
 * plonk.ms(Math.random(), 'm');
 * // => 41737.010115757585
 */
function toMilliseconds(val) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ms';
  var def = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var ms = toNumber(def, 0);
  if (typeof val === 'string') {
    val = val.toLowerCase();
    for (var i = 0; i < FORMAT_IDENTIFIERS.length; i++) {
      if (val.indexOf(FORMAT_IDENTIFIERS[i]) !== -1) {
        format = FORMAT_IDENTIFIERS[i];
        val = val.replace(' ', '').replace(format, '');
        break;
      }
    }
    val = +val;
  }
  if (val === null || typeof val === 'undefined') {
    return ms;
  }
  if (isNaN(val)) return ms;
  switch (format) {
    case 'fps':
      ms = 1000 / val;
      break;
    case 'hz':
      ms = 1 / val * 1000;
      break;
    case 'ms':
      ms = val;
      break;
    case 's':
      ms = val * 1000;
      break;
    case 'm':
      ms = val * 60 * 1000;
      break;
    default:
  }
  return ms;
}

var SINE_PERIOD = Math.PI * 2 - 0.0001;

/**
 * A sine LFO where `period` is the time, in milliseconds, of one full cycle. The current `value` of the sine is passed to both `callback` and `.progress()`, and is in the `-1...1` range.
 *
 * In addition to the sine `value`, the `callback` function is passed `cycle` (time elapsed in the current cycle), `elapsed` (total running time), and a `stop()` function. The return value of `callback` will set a new cycle duration.
 * @static
 * @memberof plonk
 * @name sine
 * @param {number} period
 * @param {function} callback
 * @returns {promise}
 * @example
 * plonk.sine(300, function (value, cycle, elapsed, stop) {
 *   if (elapsed >= 10000) {
 *     return stop('some return value');
 *   }
 *   if (cycle === 0) {
 *     // set a new duration at the begining of every cycle
 *     return plonk.rand(250, 350);
 *   }
 * })
 * .progress(function (value) {
 *   console.log(value);
 *   // => 0
 *   //    0.3020916077942207
 *   //    0.5759553818777647
 *   //    0.795998629819451
 *   //    0.9416644701608587
 *   //    ...
 * })
 * .then(function (val) {
 *   console.log(val);
 *   // => 'some return value'
 * });
 */
function sine(time) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop$1;

  time = toNumber(time, 0);

  var cycle = 0;

  return metro(1000 / 60, function (interval, i, elapsed, stop) {
    if (cycle >= time) {
      cycle = 0;
    } else {
      cycle += interval;
    }

    var rad = scale(cycle, 0, time, 0, SINE_PERIOD),
        sin = clamp(Math.sin(rad), -1, 1);

    var progress = callback(sin, cycle, elapsed, stop);
    time = toNumber(progress, time);

    return sin;
  });
}

/**
 * A simple wrapper for setTimeout that returns a promise.
 * @static
 * @memberof plonk
 * @name wait
 * @param {number} time
 * @param {function} [callback=noop]
 * @returns {promise}
 * @example
 * plonk.wait(100)
 *   .then(function (elapsed) {
 *     console.log(elapsed);
 *     // => 102.221583
 *   });
 */
function wait(time) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop$1;

  time = toNumber(time, 0);

  var def = new Deferred(),
      start = now();

  setTimeout(function () {
    var elapsed = now() - start;

    callback(elapsed);
    def.resolve(elapsed);
  }, time);

  return def.promise;
}

/**
 * Timer function where the tick interval performs a [drunk walk](https://en.wikipedia.org/wiki/Random_walk) between `min...max` milliseconds. Very similar to `dust`, except that the interval time is decided by an internal drunk walk.
 * @static
 * @memberof plonk
 * @name walk
 * @param {number} min
 * @param {number} max
 * @param {function} [callback=noop]
 * @returns {promise}
 * @example
 * plonk.walk(30, 100, function (interval, i, stop) {
 *   if (i === 10) {
 *     stop();
 *   }
 * })
 * .progress(function (interval) {
 *   console.log(interval);
 *   // => 33.142554000000004
 *   //    32.238087
 *   //    35.621671000000006
 *   //    40.125057
 *   //    41.85763399999999
 *   //    ...
 * })
 * .then(function (elapsed) {
 *   console.log(elapsed);
 *   // => 516.1664309999999
 * });
 */
function walk(min, max, callback) {
  min = toNumber(min, 10);
  max = toNumber(max, 100);

  if (arguments.length <= 2) {
    max = min;
    min = 0;
  }

  var d = drunk(min, max);

  return delay(d(), function (interval, i, elapsed, stop) {
    var progress = callback(interval, i, elapsed, stop);
    return d(progress);
  });
}

export { clamp, defer, delay, drunk, dust, env, exp, frames, metro, toMilliseconds as ms, now, rand, scale, sine, wait, walk };
