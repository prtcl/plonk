/*
 * plonk - v1.1.0
 * (c) Cory O'Brien <cory@prtcl.cc>
 * License MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var asap = _interopDefault(require('asap'));
var Promise$1 = _interopDefault(require('promise/lib/es6-extensions'));

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

function noop() {}

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
    this._resolveHandler = noop;
    this._rejectHandler = noop;

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
}(Promise$1);

function _notify(promise, val) {
  if (!promise._progressHandlers) return;
  asap(function () {
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
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
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
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

      setTimeout(callback, 0);
    };
  }

  return frame;
}();

var FORMAT_IDENTIFIERS = ['hz', 'ms', 's', 'm'];

/**
 * Number format converter that takes a variety of input time values and returns the equivalent millisecond values.
 *
 * Format options are `ms` (pass input to output), `s` (convert from seconds), `m` (convert from minutes), `hz` (convert from 1 period of hertz).
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
 * A simple wait delay (like setTimeout) that returns a promise.
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

  var def = new Deferred();

  var timer = new Timer(toNumber(time, 0), function (interval, i, elapsed) {
    if (elapsed < time) return;

    callback(interval);
    def.resolve(interval);

    timer.stop();
  });
  timer.run();

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
