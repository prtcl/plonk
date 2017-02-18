# plonk

## clamp

Constrains an input `value` to `min...max` range.

**Parameters**

-   `value` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `min` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]**  (optional, default `max`)
-   `max` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]**  (optional, default `1`)

**Examples**

```javascript
plonk.clamp(Math.random());
// => 0.13917264847745225
plonk.clamp(Math.random() * 5 - 2.5, -1, 1);
// => 1
```

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** `value` constrained to `min...max` range.

## delay

A variable timer loop where the tick interval is decided by the return value of `callback`. If none is provided, the previous/intial value is used. `time` sets the intial interval value.

The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), `elapsed` (total run time), and a `stop()` function.

**Parameters**

-   `time` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `callback` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** 

**Examples**

```javascript
var t = 100;
plonk.delay(t, function (interval, i, elapsed, stop) {
  if (i == 10) {
    return stop();
  }
  return (t = t * 1.15);
})
.progress(function (interval) {
  console.log(interval);
  // => 10
  //  115.000208
  //  132.25017300000002
  //  152.087796
  //  174.90065899999996
  //    ...
})
.then(function (elapased) {
  console.log(elapased);
  // => 2334.929456
});
```

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## drunk

Factory that returns a [drunk walk](https://en.wikipedia.org/wiki/Random_walk) random function that walks between `min...max`.

**Parameters**

-   `min` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]**  (optional, default `max`)
-   `max` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]**  (optional, default `1`)
-   `step` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]**  (optional, default `0.1`)

**Examples**

```javascript
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

Returns **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** for drunk walking.

## dust

Timer function where the tick interval jitters between `min...max` milliseconds.

The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), `elapsed` (total run time), and a `stop()` function.

**Parameters**

-   `min` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `max` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `callback` **\[[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)]**  (optional, default `noop`)

**Examples**

```javascript
plonk.dust(30, 100, function (interval, i, elapsed, stop) {
  if (i === 10) {
    stop();
  }
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

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## env

An envelope that provides linear interpolation of `value` to `target` over `time`. The `callback` function is entirely optional, as it receives the same value as `.progress()`.

Note that due to the inacurate nature of timers in JavaScript, very fast (&lt;= 50ms) `time` values do not provide reliable results.

**Parameters**

-   `value` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `target` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `time` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `callback` **\[[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)]**  (optional, default `noop`)

**Examples**

```javascript
plonk.env(-1, 1, 100)
  .progress(function (val) {
    console.log(val);
    // => -1
    //    -0.6666658999999999
    //    -0.33333203999999994
    //    0.0000022800000001321763
    //    0.33333864
    //    ...
  })
  .then(function (val) {
    console.log(val);
    // => 1
  });
```

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## exp

An exponential map of `value` in `0...1` range by [Euler's number](https://en.wikipedia.org/wiki/E_(mathematical_constant)). This makes a nice natural curve, suitable for making smooth transitions for things like audio gain, distance, and decay values.

**Parameters**

-   `value` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

**Examples**

```javascript
[0, 0.25, 0.5, 0.75, 1].forEach(function (n) {
  plonk.exp(n);
  // => 0
  //    0.023090389875362178
  //    0.15195522325791297
  //    0.45748968090533415
  //    1
});
```

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** `value` remmaped to exponential curve

## frames

Animation loop and [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) polyfill with a little extra sugar.

If `frameRate` is passed, the loop iteration time is throttled to `1000ms / frameRate`. Also differs from the native API in that the `callback` function receives `interval` (time since the previous frame), `i` (number of frames), `elapsed` (total running time), and a `stop()` function.

When `stop()` is called, the returned promise is resolved with the `elapsed` value.

**Parameters**

-   `frameRate` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]**  (optional, default `60`)
-   `callback` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** 

**Examples**

```javascript
plonk.frames(60, function (interval, i, elapsed, stop) {
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

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## metro

A repeating timer loop (like setInterval) where `time` is the tick interval in milliseconds.

The `callback` function is passed `interval` (time since the previous tick), `i` (number of ticks), `elapsed` (total run time), and a `stop()` function.

Also, the `callback` return value is passed to the `.progress()` handler, making it trivial to use `metro` to compose time-based interpolations and modulators.

When `stop(value)` is called, the returned promise is resolved with `value`.

**Parameters**

-   `time` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `callback` **\[[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)]**  (optional, default `noop`)

**Examples**

```javascript
plonk.metro(100, function (interval, i, elapsed, stop) {
  console.log(interval);
  // => 100.00048099999992
  var n = Math.random();
  if (i === 10) {
    return stop(n);
  }
  return n;
})
.progress(function (n) {
  console.log(n);
  // => 0.6465891992386279
  //    0.4153539338224437
  //    0.17397237631722784
  //    0.6499483881555588
  //    0.664554645336491
  // ...
})
.then(function (n) {
  console.log(n);
  // => 0.7674513910120222
});
```

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## ms

Number format converter that takes a variety of input time values and returns the equivalent millisecond values.

Format options are `ms` (pass input to output), `s` (convert from seconds), `m` (convert from minutes), `hz` (convert from 1 period of hertz).

`default` is returned if `value` is null, undefined, or NaN.

**Parameters**

-   `value` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `format` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]**  (optional, default `ms`)
-   `default` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]**  (optional, default `0`)

**Examples**

```javascript
plonk.ms('2s');
// => 2000
plonk.ms('30hz');
// => 33.333333333333336
plonk.ms(Math.random(), 'm');
// => 41737.010115757585
```

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** `value` formatted to milliseconds.

## now

High resolution timestamp that uses `performance.now()` in the browser, or `process.hrtime()` in Node. Provides a Date-based fallback otherwise.

**Examples**

```javascript
plonk.now();
// => 2034.65879
```

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** elapsed time in milliseconds

## rand

Random number in `min...max` range.

**Parameters**

-   `min` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]**  (optional, default `max`)
-   `max` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]**  (optional, default `1`)

**Examples**

```javascript
plonk.rand(-1, 1);
// => -0.3230291483923793
```

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** random number

## scale

Linear map of `value` in `minIn...maxIn` range to `minOut...maxOut` range.

**Parameters**

-   `value` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `minIn` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `maxIn` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `minOut` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `maxOut` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

**Examples**

```javascript
[-1, -0.5, 0, 0.5, 1].forEach(function (n) {
  plonk.scale(n, -1, 1, 33, 500);
  // => 33
  //    149.75
  //    266.5
  //    383.25
  //    500
});
```

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** `value` mapped to `minOut...maxOut` range.

## sine

A sine LFO where `period` is the time, in milliseconds, of one full cycle. The current `value` of the sine is passed to both `callback` and `.progress()`, and is in the `-1...1` range.

In addition to the sine `value`, the `callback` function is passed `cycle` (time elapsed in the current cycle), `elapsed` (total running time), and a `stop()` function. The return value of `callback` will set a new cycle duration.

**Parameters**

-   `period` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `callback` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** 

**Examples**

```javascript
plonk.sine(300, function (value, cycle, elapsed, stop) {
  if (elapsed >= 10000) {
    return stop('some return value');
  }
  if (cycle === 0) {
    // set a new duration at the begining of every cycle
    return plonk.rand(250, 350);
  }
})
.progress(function (value) {
  console.log(value);
  // => 0
  //    0.3020916077942207
  //    0.5759553818777647
  //    0.795998629819451
  //    0.9416644701608587
  //    ...
})
.then(function (val) {
  console.log(val);
  // => 'some return value'
});
```

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## wait

Simple wrapper for setTimeout that returns a promise.

**Parameters**

-   `time` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `callback` **\[[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)]**  (optional, default `noop`)

**Examples**

```javascript
plonk.wait(100)
  .then(function (elapsed) {
    console.log(elapsed);
    // => 102.221583
  });
```

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## walk

Timer function where the tick interval performs a [drunk walk](https://en.wikipedia.org/wiki/Random_walk) between `min...max` milliseconds. Very similar to `dust`, except that the interval time is decided by an internal drunk walk.

**Parameters**

-   `min` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `max` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `callback` **\[[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)]**  (optional, default `noop`)

**Examples**

```javascript
plonk.walk(30, 100, function (interval, i, stop) {
  if (i === 10) {
    stop();
  }
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

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 