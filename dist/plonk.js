/*
 * plonk - v1.1.0
 * (c) Cory O'Brien <cory@prtcl.cc> 117
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('plonk', ['exports'], factory) :
	(factory((global.plonk = global.plonk || {})));
}(this, (function (exports) { 'use strict';

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

// Wraps the passed function so that it can only be called only once
// If multiple functions are passed, an array of wrapped functions is returned
// Only one function may be called once, then all subsuquent calls to any of them are ignored

function once() {
  var ret = [];
  var called = false;

  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  var _arr = [].concat(fns);

  var _loop = function _loop() {
    var fn = _arr[_i];
    var res = void 0,
        wrapped = void 0;
    if (typeof fn === 'function') {
      wrapped = function wrapped() {
        if (!called) {
          res = fn.apply(undefined, arguments);
          called = true;
        }
        return res;
      };
    } else {
      wrapped = function wrapped() {
        called = true;
      };
    }
    ret.push(wrapped);
  };

  for (var _i = 0; _i < _arr.length; _i++) {
    _loop();
  }

  return ret.length > 1 ? ret : ret[0];
}

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



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

//
// Super minimal Promise class that also impliments progress/notify
//
// Notes about this implimentation:
//
//   * setTimeout is used instead of a microtask queue so that animation rendering is not interrupted by a higher priority task.
//       the behavior of setTimeout is also fairly uniform across environments (node, web workers, etc),
//       whereas asap-style implimentations are not.
//   * for the sake of speed, and since it's not outlined in the A+ spec, there is _no_ error handling in progress/notify methods!
//

var PENDING = {};
var FULFILLED = {};
var REJECTED = {};

var Promise$1 = function () {
  function Promise(resolver) {
    classCallCheck(this, Promise);

    if (_typeof(this) !== 'object') {
      return new Promise(resolver);
    }

    this._done = false;
    this._state = PENDING;
    this._value = null;
    this._handlers = [];

    if (typeof resolver === 'function') {
      initializeResolver(this, resolver);
    }
  }

  createClass(Promise, [{
    key: 'done',
    value: function done() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      subscribe.apply(undefined, [this].concat(args));

      if (this._state !== PENDING) {
        publish(this);
      }

      return this;
    }
  }, {
    key: 'then',
    value: function then(onResolved, onRejected, onNotify) {
      var p = new Promise();

      this.done(createResolve(p, onResolved), createReject(p, onRejected), onNotify);

      return p;
    }
  }, {
    key: 'catch',
    value: function _catch(onRejected) {
      return this.then(null, onRejected);
    }
  }, {
    key: 'progress',
    value: function progress(fn) {
      if (typeof fn === 'function') {
        subscribe(this, null, null, fn);
      }

      return this;
    }
  }]);
  return Promise;
}();

function resolve(promise, val) {

  if (promise === val) {
    var err = new TypeError('Cannot resolve a promise with itself');
    return reject(promise, err);
  }

  if (val && ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' || typeof val === 'function')) {
    var then = void 0;

    try {
      then = val.then;
    } catch (err) {
      return reject(promise, err);
    }

    if (then && typeof then === 'function') {
      return initializeResolver(promise, then.bind(val));
    }
  }

  fulfill(promise, val);
}

function fulfill(promise, val) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._done = true;
  promise._state = FULFILLED;
  promise._value = val;
}

function reject(promise, val) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._done = true;
  promise._state = REJECTED;
  promise._value = val;
}

function progress(promise, val) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._value = val;
}

function initializeResolver(promise, resolver) {
  try {
    resolver.apply(undefined, toConsumableArray(once(createResolve(promise), createReject(promise))).concat([createNotify(promise)]));
  } catch (err) {
    reject(promise, err);
    publish(promise);
  }
}

function createResolve(promise, onResolved) {
  return function () {
    if (promise._done) return;

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (typeof onResolved === 'function') {
      try {
        var res = onResolved.apply(undefined, args);
        resolve(promise, res);
      } catch (err) {
        reject(promise, err);
      }
    } else {
      resolve.apply(undefined, [promise].concat(args));
    }

    if (promise._state !== PENDING) {
      publish(promise);
    }
  };
}

function createReject(promise, onRejected) {
  return function () {
    if (promise._done) return;

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    if (typeof onRejected === 'function') {
      try {
        var res = onRejected.apply(undefined, args);
        resolve(promise, res);
      } catch (err) {
        reject(promise, err);
      }
    } else {
      reject.apply(undefined, [promise].concat(args));
    }

    if (promise._state !== PENDING) {
      publish(promise);
    }
  };
}

function createNotify(promise) {
  return function () {
    if (promise._done) return;

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    progress.apply(undefined, [promise].concat(args));
    publish(promise);
  };
}

var Handler = function Handler(onResolved, onRejected, onNotify) {
  classCallCheck(this, Handler);

  this.onResolved = typeof onResolved === 'function' ? once(onResolved) : null;
  this.onRejected = typeof onRejected === 'function' ? once(onRejected) : null;
  this.onNotify = typeof onNotify === 'function' ? onNotify : null;
};

function subscribe(promise) {
  for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  promise._handlers.push(new (Function.prototype.bind.apply(Handler, [null].concat(args)))());
}

function publish(promise) {
  var method = void 0;

  switch (promise._state) {
    case PENDING:
      method = 'onNotify';
      break;
    case FULFILLED:
      method = 'onResolved';
      break;
    case REJECTED:
      method = 'onRejected';
      break;
    default:
      method = 'onNotify';
  }

  var val = promise._value;

  setTimeout(function () {
    promise._handlers.forEach(function (h) {
      var fn = h[method];
      fn && fn(val);
    });
  }, 0);
}

// A basic Deferred class that is used for all promises internally
// It's exposed as plonk.defer, but not documented, since plonk is not trying to be a promise library

function defer() {
  return new Deferred();
}

var Deferred = function Deferred() {
  var _this = this;

  classCallCheck(this, Deferred);

  this.promise = new Promise$1(function (resolve$$1, reject$$1, notify) {
    _this.resolve = function () {
      return resolve$$1.apply(undefined, arguments);
    };
    _this.reject = function () {
      return reject$$1.apply(undefined, arguments);
    };
    _this.notify = function () {
      return notify.apply(undefined, arguments);
    };
  });
};

function noop() {}

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

// try to choose the best method for producing a performance.now() timestamp
var now = function () {

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

// Generic high-resolution timer class that forms the basis for all other timers

var Timer = function () {
  function Timer(time, callback) {
    classCallCheck(this, Timer);

    if (typeof callback !== 'function') {
      throw new TypeError('Timer callback needs to be a function');
    }

    this._tickHandler = tickHandler;
    this._timeOffset = 0;
    this._callback = callback;
    this._prev = 0;

    this.isRunning = false;
    this.time = this._initialTime = toNumber(time, 1000 / 60);
    this.interval = 0;

    this.reset();
  }

  createClass(Timer, [{
    key: '_callTickHandler',
    value: function _callTickHandler() {
      var _this = this;

      if (!this.isRunning) {
        return;
      }

      this._tickHandler(function () {

        // first tick
        if (_this.iterations === 0) {
          _this._callback && _this._callback(0, 0, 0);
          _this._prev = now();

          _this.iterations = 1;

          return _this._callTickHandler();
        }

        _this.interval = now() - _this._prev;

        // interval is below target interval
        if (_this.interval <= _this.time + _this._timeOffset) {
          return _this._callTickHandler();
        }

        _this.elapsed += _this.interval;
        _this._callback && _this._callback(_this.interval, _this.iterations, _this.elapsed);

        if (_this.isRunning) {
          _this._prev = now();
          _this.iterations += 1;
          _this._callTickHandler();
        }
      });
    }
  }, {
    key: 'run',
    value: function run() {
      if (this.isRunning) {
        return this;
      }

      this._prev = now();
      this.isRunning = true;
      this._callTickHandler();

      return this;
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

      this._prev = 0;
      this.elapsed = 0;
      this.iterations = 0;
      this.interval = 0;

      this.time = this._initialTime;

      return this;
    }
  }]);
  return Timer;
}();

function tickHandler() {
  var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

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
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

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
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

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
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

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
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;

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

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

// 7.1.13 ToObject(argument)
var defined = _defined;
var _toObject = function(it){
  return Object(defined(it));
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function(it, key){
  return hasOwnProperty.call(it, key);
};

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
});

var global$1 = _global;
var SHARED = '__core-js_shared__';
var store  = global$1[SHARED] || (global$1[SHARED] = {});
var _shared = function(key){
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');
var uid    = _uid;
var _sharedKey = function(key){
  return shared[key] || (shared[key] = uid(key));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = _has;
var toObject$1    = _toObject;
var IE_PROTO    = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function(O){
  O = toObject$1(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var _core = createCommonjsModule(function (module) {
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
});

var _aFunction = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding
var aFunction = _aFunction;
var _ctx = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

var _isObject = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var isObject = _isObject;
var _anObject = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

var isObject$1 = _isObject;
var document = _global.document;
var is = isObject$1(document) && isObject$1(document.createElement);
var _domCreate = function(it){
  return is ? document.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function(){
  return Object.defineProperty(_domCreate('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject$2 = _isObject;
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function(it, S){
  if(!isObject$2(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject$2(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

var anObject       = _anObject;
var IE8_DOM_DEFINE = _ie8DomDefine;
var toPrimitive    = _toPrimitive;
var dP$1             = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP$1(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

var dP         = _objectDp;
var createDesc = _propertyDesc;
var _hide = _descriptors ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

var global$2    = _global;
var core$1      = _core;
var ctx       = _ctx;
var hide      = _hide;
var PROTOTYPE = 'prototype';

var $export$1 = function(type, name, source){
  var IS_FORCED = type & $export$1.F
    , IS_GLOBAL = type & $export$1.G
    , IS_STATIC = type & $export$1.S
    , IS_PROTO  = type & $export$1.P
    , IS_BIND   = type & $export$1.B
    , IS_WRAP   = type & $export$1.W
    , exports   = IS_GLOBAL ? core$1 : core$1[name] || (core$1[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global$2 : IS_STATIC ? global$2[name] : (global$2[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global$2)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export$1.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export$1.F = 1;   // forced
$export$1.G = 2;   // global
$export$1.S = 4;   // static
$export$1.P = 8;   // proto
$export$1.B = 16;  // bind
$export$1.W = 32;  // wrap
$export$1.U = 64;  // safe
$export$1.R = 128; // real proto method for `library` 
var _export = $export$1;

// most Object methods by ES6 should accept primitives
var $export = _export;
var core    = _core;
var fails   = _fails;
var _objectSap = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = _toObject;
var $getPrototypeOf = _objectGpo;

_objectSap('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

var getPrototypeOf$1 = _core.Object.getPrototypeOf;

var getPrototypeOf = createCommonjsModule(function (module) {
module.exports = { "default": getPrototypeOf$1, __esModule: true };
});

var _Object$getPrototypeOf = unwrapExports(getPrototypeOf);

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
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;


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
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
    classCallCheck(this, Frames);

    var _this = possibleConstructorReturn(this, (Frames.__proto__ || _Object$getPrototypeOf(Frames)).call(this, time, callback));

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
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

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
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

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
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

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

exports.clamp = clamp;
exports.defer = defer;
exports.delay = delay;
exports.drunk = drunk;
exports.dust = dust;
exports.env = env;
exports.exp = exp;
exports.frames = frames;
exports.metro = metro;
exports.ms = toMilliseconds;
exports.now = now;
exports.rand = rand;
exports.scale = scale;
exports.sine = sine;
exports.wait = wait;
exports.walk = walk;

Object.defineProperty(exports, '__esModule', { value: true });

})));
