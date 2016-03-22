
# plonk.js

* <a href="#constrain">`plonk.constrain`</a>
* <a href="#debounce">`plonk.debounce`</a>
* <a href="#defer">`plonk.defer`</a>
* <a href="#delay">`plonk.delay`</a>
* <a href="#drunk">`plonk.drunk`</a>
* <a href="#dust">`plonk.dust`</a>
* <a href="#env">`plonk.env`</a>
* <a href="#exp">`plonk.exp`</a>
* <a href="#frames">`plonk.frames`</a>
* <a href="#metro">`plonk.metro`</a>
* <a href="#now">`plonk.now`</a>
* <a href="#rand">`plonk.rand`</a>
* <a href="#sine">`plonk.sine`</a>
* <a href="#scale">`plonk.scale`</a>
* <a href="#tick">`plonk.tick`</a>
* <a href="#toMilliseconds">`plonk.toMilliseconds`</a>
* <a href="#toNumber">`plonk.toNumber`</a>
* <a href="#wait">`plonk.wait`</a>
* <a href="#walk">`plonk.walk`</a>
***

### <a id="constrain"></a>`plonk.constrain(value, [min=0|max], [max=1])`

Constrains an input `value` to `min...max` range.

```js
plonk.constrain(Math.random());
// => 0.13917264847745225
plonk.constrain(Math.random() * 5 - 2.5, -1, 1);
// => 1
```
***

### <a id="debounce"></a>`plonk.debounce([time=100], callback)`

The classic debounce factory. Returns a wrapper around `callback` that will only be executed once, `time` milliseconds after the last call.

```js
var n = 0;
var debounced = plonk.debounce(100, function () { n++; });
for (var i = 0; i < 10; i++) {
  setTimeout(debounced, 0);
}
setTimeout(function () {
  console.log(n);
  // => 1
}, 200);
```
***

### <a id="defer"></a>`plonk.defer()`

A very simple Deferred object that's extended to include notify/progress methods. This is mostly for internal use, but it's there if you need it.

```js
function async () {
  var def = plonk.defer();
  def.notify(0);
  def.resolve(1);
  return def.promise; // a native Promise
}
async()
  .progress(function (val) {
    console.log(val);
    // => 0
  })
  .then(function (val) {
    console.log(val);
    // => 1
  });
```
***

### <a id="delay"></a>`plonk.delay(time, [callback])`

A variable timer loop where the tick interval is decided by the return value of `callback`. If none is provided, the previous/intial value is used. `time` sets the intial interval value.

The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), and a `stop()` function.

```js
var t = 100;
plonk.delay(t, function (interval, i, stop) {
  if (i == 10) return stop();
  return t = t * 1.15;
})
.progress(function (interval) {
  console.log(interval);
  // => 101.240485
  //    116.455409
  //    133.112382
  //    153.69553200000001
  //    174.27022699999998
  //    ...
})
.then(function (elapsed) {
  console.log(elapased);
  // => 351.988523
});
```
***

### <a id="drunk"></a>`plonk.drunk([min=0|max], [max=1], [step=0.1])`

Factory that returns a [drunk walk](https://en.wikipedia.org/wiki/Random_walk) random function that walks between `min...max`. An optional `step` value in `0...1` range will scale the length of each step.

```js
var drunk = plonk.drunk(-1, 1);
for (var i = 0; i < 100; i++) {
  console.log(drunk());
  // => 0.9912726839073003
  //    0.9402238005306572
  //    0.8469231501687319
  //    0.9363016556948425
  //    0.9024078783579172
  //    ...
}
```
***

### <a id="dust"></a>`plonk.dust(min, max, [callback])`

Timer function where the tick interval jitters between `min...max` milliseconds. 

The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), and a `stop()` function.

```js
plonk.dust(30, 100, function (interval, i, stop) {
  if (i === 10) stop();
})
.progress(function (interval) {
  console.log(interval);
  // => 74.155273
  //    53.998158000000004
  //    99.259871
  //    53.27543200000002
  //    77.56419299999999
  //    ...
})
.then(function (elapsed) {
  console.log(elapsed);
  // => 663.0071679999999
});
```

***

### <a id="env"></a>`plonk.env(value, target, time, [callback])`

An envelope that provides linear interpolation of `value` to `target` over `time`. The `callback` function is entirely optional, as it receives the same value as `.progress()`. 

Note that due to the inacurate nature of timers in JavaScript, very fast (<= 50ms) `time` values do not provide reliable results.

```js
plonk.env(-1, 1, 100)
  .progress(function (val) {
    console.log(val);
    // => -1
    //    -0.86759346
    //    -0.4624115000000001
    //    -0.34194526000000014
    //    -0.23357504000000007
    //    ...
  })
  .then(function (val) {
    console.log(val);
    // => 1
  });
```

***

### <a id="exp"></a>`plonk.exp(number)`

An exponential map of `number` in `0...1` range by [Euler's number](https://en.wikipedia.org/wiki/E_(mathematical_constant)). This makes a nice natural curve, suitable for making smoother transitions for things like audio gain, distance, and decay values.

```js
[0, 0.25, 0.5, 0.75, 1].forEach(function (n) {
  plonk.exp(n);
  // => 0
  //    0.023090389875362178
  //    0.15195522325791297
  //    0.45748968090533415
  //    1
});
```

***

### <a id="frames"></a>`plonk.frames([frameRate=60], callback)`

Animation loop and [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) polyfill with a little extra sugar.

If `frameRate` is passed, then loop iteration time is throttled to `1000 / frameRate`. Also differs from the native API in that the `callback` function recieves `interval` (time since the previous frame), `elapsed` (total running time), `i` (number of frames), and a `stop()` function. When `stop()` is called, the returned Promise is resolved with the `elapsed` value.

```js
plonk.frames(60, function (interval, elapsed, i, stop) {
  console.log(interval);
  // => 16.723718000000005
  if (someCondition) {
    // we can change the target framerate by return value;
    return 30;
  } else if (i === 10) {
    stop();
  }
})
.then(function (elapsed) {
  console.log(elapsed);
  // => 233.34382600000004
});
```

***

### <a id="metro"></a>`plonk.metro(time, [callback])`

setInterval wrapper where `time` is the tick interval in milliseconds.

The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), and a `stop()` function. The `callback` return value is passed to the `.progress()` handler, making it trivial to use `plonk.metro` to compose time-based interpolations and modulators.

When `stop(value)` is called, the timer stops, and the returned promise is resolved with `value`.

```js
var n = 0;
plonk.metro(4, function (interval, i, stop) {
  console.log(interval);
  // => 4.246183000000002
  n += Math.random();
  if (i === 10) return stop(n);
  return n;
})
.progress(function (n) {
  console.log(n);
  // => 0.8043495751917362
  //    1.0118556288070977
  //    1.535184230422601
  //    1.9694649016018957
  //    2.188968440517783
  //    ...
})
.then(function (n) {
  console.log(n);
  // => 5.08520966116339
});
```
***

### <a id="now"></a>`plonk.now()`

High resolution timestamp that uses `performance.now()` in the browser, or `process.hrtime()` in Node. Provides a Date-based fallback otherwise.

```js
plonk.now();
// => 2034.65879
```
***

### <a id="rand"></a>`plonk.rand(min=0|max, [max=1])`

Random number in `min...max` range.

```js
plonk.rand(-1, 1);
// => -0.3230291483923793
```
***

### <a id="sine"></a>`plonk.sine(period, [callback])`

A sine LFO where `period` is the time in milliseconds of one full cycle. The current `value` of the sine is passed to both `callback` and `.progress()`, and is in the `-1...1` range.

In addition to the sine `value`, the `callback` function is passed `cycle` (time elapsed in the current cycle), `elapsed` (total running time), and a `stop()` function. The return value of `callback` will set a new cycle duration.

```js
plonk.sine(300, function (value, cycle, elapsed, stop) {
  if (elapsed >= 10000) return stop('some return value');
  if (cycle === 0) {
    // set a new duration at the begining of every cycle
    return plonk.rand(250, 350);
  }
})
.progress(function (value) {
  console.log(value);
  // => 0
  //    0.12071966755713318
  //    0.48600214034421146
  //    0.5692098047602766
  //    0.635380313957961
  //    ...
})
.then(function (val) {
  console.log(val);
  // => 'some return value'
});
```

***

### <a id="scale"></a>`plonk.scale(value, minIn, maxIn, minOut, maxOut)`

Linear map of `value` in `minIn...maxIn` range to `minOut...maxOut` range.

```js
[-1, -0.5, 0, 0.5, 1].forEach(function (n) {
  plonk.scale(n, -1, 1, 33, 500);
  // => 33
  //    149.75
  //    266.5
  //    383.25
  //    500
});
```

***

### <a id="tick"></a>`plonk.tick(callback)`

`nextTick` polyfill that chooses the fastest method for the current environment from `process.nextTick`, `setImmediate`, `MessageChannel`, or `setTimeout`.

```js
plonk.tick(function () {
  console.log(1);
});
console.log(0);
// => 0
// => 1
```
***

### <a id="toMilliseconds"></a>`plonk.toMilliseconds(value, [format='ms'], [default=0])`

Also aliased to `plonk.ms`.

Number format converter that takes a variety of input time values and returns the equivalent millisecond values. Format options are `ms` (pass input to output), `s` (convert from seconds), `m` (convert from minutes), `hz` (convert from 1 period of hertz). `default` is returned if `value` is null, undefined, or NaN.

```js
plonk.ms('2s');
// => 2000
plonk.ms('30hz');
// => 33.333333333333336
plonk.ms(Math.random(), 'm');
// => 41737.010115757585
```
***

### <a id="toNumber"></a>`plonk.toNumber(value, [default=0])`

Passes `value` unaltered if it is a Number, converts to Number if it's a coercible String, or returns `default` if null, undefined, or NaN.

```js
plonk.toNumber(1);
// => 1
plonk.toNumber('2');
// => 2
var n;
plonk.toNumber(n, 10);
// => 10
```
***

### <a id="wait"></a>`plonk.wait(time, [callback])`

Simple wrapper for setTimeout that returns a promise.

```js
plonk.wait(100)
  .then(function (elapsed) {
    console.log(elapsed);
    // => 102.221583
  });
```
***

### <a id="walk"></a>`plonk.walk(min, max, [callback])`

Timer function where the tick interval performs a [drunk walk](https://en.wikipedia.org/wiki/Random_walk) between `min...max` milliseconds. Very similar to <a href="#dust">`plonk.dust`</a>, except that the interval time is decided by <a href="#drunk">`plonk.drunk`</a>.

```js
plonk.walk(30, 100, function (interval, i, stop) {
  if (i === 10) stop();
})
.progress(function (interval) {
  console.log(interval);
  // => 33.142554000000004
  //    32.238087
  //    35.621671000000006
  //    40.125057
  //    41.85763399999999
  //    ...
})
.then(function (elapsed) {
  console.log(elapsed);
  // => 516.1664309999999
});
```
***
