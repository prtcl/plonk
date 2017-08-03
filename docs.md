
# plonk

plonk is a JavaScript micro-library that provides timers, envelopes, and random generators. Many of the functions are inspired by objects in creative coding environments like Max and SuperCollider. However, the purpose of plonk is not to be a monolithic framework or language environment, but rather to compliment your current (or lack of) framework/libraries. 

Core concepts:

* Every time-based function returns a promise that has a progress method.
* Every time-based function receives a callback function, which itself receives info like elapsed time, number of iterations, etc.
* Many functions accept return values from callbacks that are either passed to the returned promise, or used to control behavior (e.g. interval timing).
* All reported time values (intervals, elapsed time, etc) use a performance.now() style timestamp.
* Unless otherwise noted, functions like `env` run at 60fps (e.g. 1000ms / 60fps = 16.666ms).

Why promises instead of events? Promises are chainable, so you can do cool things like create ASR envelopes with just a few functions:

```javascript
plonk.env(0, 1, 264)
  .progress(console.log)
  .then(console.log)
  .then(() => plonk.wait(33))
  .then(() => plonk.env(1, 0, 792))
  .progress(console.log)
  .then(console.log)
  .catch(console.error);

// => 0
//    0.06796374242424244
//    0.13111420454545453
//    0.1960540643939394
//    0.26116883712121214
//    ...
```

## Classes

Most of the time, you'll be using one of the higher level functions in plonk. But there's a couple classes that are exported in case you want to construct your own functions.

### Deferred

A basic deferred class that’s used for all promises internally. plonk isn't really trying to be a Promise library, but it's here if you need it.

```javascript
const deferred = new plonk.Deferred();

// a Promises/A+ compliant promise that's been extended with progress/notify methods
const promise = deferred.promise;

promise
  .progress((val) => {
    console.log(val);
    // => 0
  })
  .then((val) => {
    console.log(val);
    //=> 1
  })
  .catch((err) => {
    console.error(err);
  });

deferred.notify(0);

if (somethingGood) {
  deferred.resolve(1);
} else {
  deferred.reject(new Error('Not good'));
}
```

### Timer

This is the base timer class in plonk.

The first argument is the time interval in milliseconds, which can be updated at any time with `Timer#setTime()`.

The callback receives `interval` (time since the previous tick), `i` (number of ticks), and `elapsed` (total run time).

Unlike the timer functions in plonk, you must call `Timer#run()` to start a Timer.

```javascript
let time = 100;

const timer = new plonk.Timer(time, (interval, i, elapsed) => {
  console.log(interval, i, elapsed);
  // => 0 0 0
  //    91.338397 1 91.338397
  //    103.92008699999998 2 195.25848399999998
  //    120.07250400000001 3 315.330988
  //    111.23462899999998 4 426.565617
  //    ...

  if (i === 10) {
    timer.stop();
  } else {
    // you can set a new interval time whenever, even mid-tick
    time += plonk.rand(-20, 20);
    timer.setTime(time);
  }
});

timer.run();
```

## Functions

### clamp

Constrains an input `value` to `min...max` range.

```javascript
let min = -1,
    max = 1;

plonk.clamp(-0.214, min, max);
// => -0.214

plonk.clamp(1.5, min, max);
// => 1
```

### delay

A timer loop, similar to setInterval, except that the time interval can be reset by the return value of the callback function. If none is provided, the previous/initial value is used.

The callback function is passed `interval` (time since the previous tick), `i` (number of ticks), `elapsed` (total run time), and a `stop()` function.

```javascript
let time = 100;

plonk.delay(time, (interval, i, elapsed, stop) => {
  if (i == 10) {
    return stop();
  }
  return (time *= 1.15);
})
.progress((interval) => {
  console.log(interval);
  // => 0
  //    115.000208
  //    132.25017300000002
  //    152.087796
  //    174.90065899999996
  //    ...
})
.then((elapsed) => {
  console.log(elapsed);
  // => 2334.929456
});
```

### drunk

Factory that returns a [drunk walk](https://en.wikipedia.org/wiki/Random_walk) random function that walks between `min...max`.

An optional third parameter, `step`, is a number between `0...1`, and controls the "length" of each step. This can also be passed into the returned function on each call. 

```javascript
const min = -1,
      max = 1;

const drunk = plonk.drunk(min, max);

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

### dust

Timer function where the time interval jitters between `min...max` milliseconds.

The callback function is passed `interval` (time since the previous tick), `i` (number of ticks), `elapsed` (total run time), and a `stop()` function.

```javascript
let min = 32,
    max = 128;

plonk.dust(min, max, (interval, i, elapsed, stop) => {
  if (i === 10) {
    stop();
  }
})
.progress((interval) => {
  console.log(interval);
  // => 0
  //    53.070578
  //    81.95766799999998
  //    71.441327
  //    53.544591000000025
  //    ...
})
.then((elapsed) => {
  console.log(elapsed);
  // => 663.0071679999999
});
```

### env

An envelope that provides linear interpolation of `value` to `target` over `time`.

The callback function is entirely optional, as it receives the same value as `Promise#progress()`.

```javascript
let value = -1,
    target = 1,
    time = 100;

plonk.env(value, target, time)
  .progress((val) => {
    console.log(val);
    // => -1
    //    -0.6666658999999999
    //    -0.33333203999999994
    //    0.0000022800000001321763
    //    0.33333864
    //    ...
  })
  .then((val) => {
    console.log(val);
    // => 1
  });
```

### exp

An exponential map of `value` in `0...1` range by [Euler's number](https://en.wikipedia.org/wiki/E_(mathematical_constant)). This makes a nice natural curve, suitable for making smooth transitions for things like audio gain, distance, and decay values.

```javascript
[0, 0.25, 0.5, 0.75, 1].map(plonk.exp);
// => [ 0,
//      0.023090389875362178,
//      0.15195522325791297,
//      0.45748968090533415,
//      1 ]
```

### frames

Animation loop and [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) polyfill with a little extra sugar.

If `frameRate` is passed, the loop iteration time is throttled to `1000ms / frameRate`. Also differs from the native API in that the `callback` function receives `interval` (time since the previous frame), `i` (number of frames), `elapsed` (total running time), and a `stop()` function.

When `stop()` is called, the returned promise is resolved with the `elapsed` time value.

```javascript
let frameRate = 60;

plonk.frames(frameRate, (interval, i, elapsed, stop) => {
  console.log(interval);
  // => 16.723718000000005
  //    ...

  if (someCondition) {
    // we can change the target frame rate by return value
    // e.g. if we detect that our animation is consuming too many resources
    return (frameRate = 30);
  }
  if (i === 10) {
    stop();
  }
})
.then((elapsed) => {
  console.log(elapsed);
  // => 233.34382600000004
});
```

### metro

A repeating timer loop, similar to setInterval, where `time` is the tick interval in milliseconds.

metro is special in that the callback return value is passed to the `Promise#progress()` handler, making it trivial to compose time-based interpolations and modulators.

Like `plonk.delay`, the callback function is passed `interval` (time since the previous tick), `i` (number of ticks), `elapsed` (total run time), and a `stop()` function.

When `stop(value)` is called, the returned `promise` is resolved with `value`.

```javascript
let time = 1000 / 60;

plonk.metro(time, (interval, i, elapsed, stop) => {
  console.log(interval);
  // => 0
  //    17.204039999999996
  //    17.676087000000003
  //    17.707869000000002
  //    17.516894000000008
  //    ...

  if (i === 10) {
    stop('done');
  }
})
.then((val) => {
  console.log(val);
  // => 'done'
});
```

Since metro passes the return value of it's callback to the returned promise, you can do cool things like process an array over time.

```javascript
arrayOverTime([1, 2, 3, 4, 5])
  .progress((n) => {
    console.log(n);
    // => 1
    //    2
    //    3
    //    4
    //    5
  })
  .then((arr) => {
    console.log(arr);
    // => [ 1, 2, 3, 4, 5 ]
  });

function arrayOverTime (arr = []) {
  return plonk.metro(1000 / 60, (int, idx, elpsd, stop) => {
    if (idx > arr.length - 1) {
      return stop(arr);
    }

    return arr[idx];
  });
}
```

Or, compose functions over time :)

```javascript
const roundFps = composeOverTime(Math.floor, plonk.ms);

roundFps('60fps')
  .progress((val) => {
    console.log(val);
    // => 16.666666666666668
    //    16
  })
  .then((val) => {
    console.log(val);
    // => 16
  });

function composeOverTime (...fns) {
  fns.reverse();

  return function (...args) {
    let ret;

    return plonk.metro(1, (int, idx, elpsd, stop) => {
      if (idx > fns.length - 1) {
        return stop(ret);
      }

      const fn = fns[idx];

      if (typeof fn === 'function') {
        ret = idx === 0 ? fn(...args) : fn(ret);
      }

      return ret;
    });
  };
}
```

### ms / toMilliseconds

Number format converter that takes a variety of input time values and returns the equivalent millisecond values.

Format options are `ms` (pass input to output), `s` (seconds), `m` (minutes), `hz` (1 period hertz), and `fps` (frames per second).

```javascript
plonk.ms('2s');
// => 2000

plonk.ms('30hz');
// => 33.333333333333336

let fps = 60;
plonk.toMilliseconds(fps, 'fps');
// => 16.666666666666668
```

### now

High resolution timestamp that uses `performance.now()` in the browser, or `process.hrtime()` in Node. Provides a Date-based fallback otherwise.

```javascript
plonk.now();
// => 2034.65879
```

### rand

Returns a random number in `min...max` range.

```javascript
plonk.rand(-1, 1);
// => -0.3230291483923793
```

### scale

Linear map of `value` in `minIn...maxIn` range to `minOut...maxOut` range.

```javascript
let minIn = -1,
    maxIn = 1,
    minOut = 33,
    maxOut = 500;

[-1, -0.5, 0, 0.5, 1].map((n) => plonk.scale(n, minIn, maxIn, minOut, maxOut));
// => [33, 149.75, 266.5, 383.25, 500]
```

### sine

A sine LFO where `period` is the time, in milliseconds, of one full cycle. The current `value` of the sine is passed to both the callback and `Promise#progress()`, and is in the `-1...1` range.

In addition to the sine `value`, the callback function is passed `cycle` (time elapsed in the current cycle), `elapsed` (total running time), and a `stop()` function.

A return value from callback will set a new cycle duration.

```javascript
let period = plonk.ms('3hz');

plonk.sine(period, (value, cycle, elapsed, stop) => {
  if (elapsed >= 10000) {
    return stop();
  }
  if (cycle === 0) {
    // set a new duration at the beginning of every cycle
    let hz = plonk.rand(1, 5);
    return plonk.ms(hz, 'hz');
  }
})
.progress((value) => {
  console.log(value);
  // => 0
  //    0.4623530621253338
  //    0.7935804661710562
  //    0.9481604654659164
  //    0.9995799180389129
  //    ...
});
```

### wait

A simple wrapper for setTimeout that returns a promise.

```javascript
plonk.wait(100)
  .then((elapsed) => {
    console.log(elapsed);
    // => 102.221583
  });
```

### walk

Timer function where the time interval performs a [drunk walk](https://en.wikipedia.org/wiki/Random_walk) between `min...max` milliseconds.

Very similar to `plonk.dust`, except that the interval time is decided by an internal drunk walk, rather than a purely random value.

```javascript
let min = 32,
    max = 128;

plonk.walk(min, max, (interval, i, elapsed, stop) => {
  if (i === 10) {
    stop();
  }
})
.progress((interval) => {
  console.log(interval);
  // => 0
  //    41.652237
  //    32.64476500000001
  //    32.621325999999996
  //    43.40436699999999
  //    ...
})
.then((elapsed) => {
  console.log(elapsed);
  // => 517.7571049999999
});
```
