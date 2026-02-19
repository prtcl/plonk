# API Reference

## Core Concepts

Plonk's generators (`Drunk`, `Rand`, `Env`, `Sine`, `Scale`) follow an iterator-inspired pattern: each is a stateful object you pull values from by calling `next()`. They don't run on their own — you decide when and where to advance them, whether that's inside a `Metro` callback, a Web Audio `ScriptProcessorNode`, a game loop, or a React effect.

The timers (`Metro`, `Frames`) provide the "when" — high-resolution loops that fire callbacks at regular intervals with runtime metrics. The generators provide the "what" — streams of values shaped by envelopes, random walks, and oscillations. Compose them however you like.

For convenience, every class and function has a lowercase counterpart, for those who wish to `import * as p from '@prtcl/plonk'` and work in a terse, functional style via `p.drunk()`, `p.fold(n)`, etc.

The React hooks in `@prtcl/plonk-hooks` are a thin integration layers which manage timer lifecycle on mount/unmount. The core library has no framework dependencies.

## Timers

### Metro

High-resolution recursive timer with variable interval, provides runtime metrics via callback for time-based calculations.

```typescript
import { Metro } from '@prtcl/plonk';

const metro = new Metro(
  (timer) => {
    console.log(timer.state.iterations, timer.state.tickInterval);
  },
  { time: 100 }
);

metro.run();

// Later...
metro.stop();
```

#### Options

| Option | Type     | Default  | Description                 |
| ------ | -------- | -------- | --------------------------- |
| `time` | `number` | `~16.67` | Interval between ticks (ms) |

#### Methods

| Method        | Returns  | Description                                      |
| ------------- | -------- | ------------------------------------------------ |
| `run()`       | `void`   | Starts the timer loop                            |
| `stop()`      | `number` | Stops the timer, returns total elapsed time (ms) |
| `reset()`     | `void`   | Resets state to initial values                   |
| `setTime(ms)` | `void`   | Updates the tick interval                        |

#### State

| Property       | Type      | Description                          |
| -------------- | --------- | ------------------------------------ |
| `isRunning`    | `boolean` | Whether the timer is active          |
| `iterations`   | `number`  | Number of completed ticks            |
| `tickInterval` | `number`  | Time elapsed since the previous tick |
| `time`         | `number`  | Current interval setting             |
| `totalElapsed` | `number`  | Total time elapsed since `run()`     |

---

### Frames

Animation-loop timer which uses `requestAnimationFrame` when available, falling back to `setTimeout`. Extends `Metro`.

```typescript
import { Frames } from '@prtcl/plonk';

const frames = new Frames(
  (timer) => {
    console.log(timer.state.iterations);
  },
  { fps: 30 }
);

frames.run();
```

#### Options

| Option | Type             | Default | Description              |
| ------ | ---------------- | ------- | ------------------------ |
| `fps`  | `15 \| 30 \| 60` | `60`    | Target frames per second |

#### Methods

Inherits all methods from `Metro`, plus:

| Method        | Returns | Description            |
| ------------- | ------- | ---------------------- |
| `setFPS(fps)` | `void`  | Updates the target FPS |

---

## Math / Generators

### Drunk

Stochastic random walk generator that produces values within a bounded range.

```typescript
import { Drunk } from '@prtcl/plonk';

const d = new Drunk({ min: -1, max: 1, step: 0.2 });

d.value(); // initial value
d.next(); // take one step
d.next(); // take another step
```

#### Options

| Option     | Type     | Default | Description                                    |
| ---------- | -------- | ------- | ---------------------------------------------- |
| `min`      | `number` | `0`     | Lower bound                                    |
| `max`      | `number` | `1`     | Upper bound                                    |
| `step`     | `number` | `0.1`   | Max step size as a fraction of the range (0-1) |
| `startsAt` | `number` | random  | Initial value                                  |

#### Methods

| Method                   | Returns  | Description                                 |
| ------------------------ | -------- | ------------------------------------------- |
| `value()`                | `number` | Returns the current value                   |
| `next()`                 | `number` | Advances one step and returns the new value |
| `setRange({ min, max })` | `void`   | Updates the walk bounds                     |
| `setStepSize({ step })`  | `void`   | Updates the step size                       |
| `reset(opts?)`           | `void`   | Resets the walk with optional new options   |

---

### Env

Linear envelope which interpolates between two values over a duration. Useful for audio envelopes, transitions, and animations.

```typescript
import { Env } from '@prtcl/plonk';
import { Frames } from '@prtcl/plonk';

const env = new Env({ duration: 1000, from: 0, to: 1 });

const frames = new Frames(() => {
  const val = env.next();
  console.log(val); // 0...1 over 1 second

  if (env.done()) {
    frames.stop();
  }
});

frames.run();
```

#### Options

| Option     | Type     | Default | Description            |
| ---------- | -------- | ------- | ---------------------- |
| `duration` | `number` | `0`     | Envelope duration (ms) |
| `from`     | `number` | `0`     | Starting value         |
| `to`       | `number` | `1`     | Ending value           |

#### Methods

| Method            | Returns   | Description                                     |
| ----------------- | --------- | ----------------------------------------------- |
| `value()`         | `number`  | Returns the current interpolated value          |
| `next()`          | `number`  | Advances the envelope and returns the new value |
| `done()`          | `boolean` | Returns true when the envelope has completed    |
| `setDuration(ms)` | `void`    | Updates the envelope duration                   |
| `reset(opts?)`    | `void`    | Restarts the envelope with optional new options |

---

### Noise

Noise generator using the Voss-McCartney algorithm with pink/white balance. Sums octave-spaced random sources, updating one band per sample for constant cost regardless of octave count. The `octaves` parameter controls the low-frequency depth — fewer octaves produce wider steps and more drift, more octaves concentrate the output closer to center. The `balance` parameter crossfades between the shaped pink noise and raw white noise.

```typescript
import { Noise } from '@prtcl/plonk';

const n = new Noise({ octaves: 12, balance: 0.2 });

n.next(); // pink noise with a little white dust
n.next();

// Adjust the balance on the fly
n.setBalance(0.5);
```

#### Options

| Option    | Type     | Default | Description                                      |
| --------- | -------- | ------- | ------------------------------------------------ |
| `octaves` | `number` | `8`     | Number of octave bands for low-frequency depth   |
| `balance` | `number` | `0`     | Crossfade between pink (0) and white (1) noise   |

#### Methods

| Method           | Returns  | Description                                     |
| ---------------- | -------- | ----------------------------------------------- |
| `value()`        | `number` | Returns the current noise value                 |
| `next()`         | `number` | Advances the generator and returns a new sample |
| `setBalance(n)`  | `void`   | Updates the pink/white crossfade (0-1)          |

---

### Rand

Random number generator that produces values within a bounded range.

```typescript
import { Rand } from '@prtcl/plonk';

const r = new Rand({ min: 0, max: 100 });

r.value(); // current random value
r.next(); // generate a new random value
```

#### Options

| Option | Type     | Default | Description |
| ------ | -------- | ------- | ----------- |
| `min`  | `number` | `0`     | Lower bound |
| `max`  | `number` | `1`     | Upper bound |

#### Methods

| Method                   | Returns  | Description                             |
| ------------------------ | -------- | --------------------------------------- |
| `value()`                | `number` | Returns the current value               |
| `next()`                 | `number` | Generates and returns a new value       |
| `setRange({ min, max })` | `void`   | Updates the range bounds                |
| `Rand.rand(opts?)`       | `number` | Static one-shot, returns a random value |

---

### Scale

Linear map of values from `from` range to `to` range, supports negative values and inversion.

```typescript
import { Scale } from '@prtcl/plonk';

const s = new Scale({
  from: { min: 0, max: 127 },
  to: { min: 0, max: 1 },
});

s.scale(64); // ~0.504
s.scale(127); // 1
s.scale(0); // 0
```

#### Options

| Option | Type         | Default              | Description  |
| ------ | ------------ | -------------------- | ------------ |
| `from` | `ScaleRange` | `{ min: 0, max: 1 }` | Input range  |
| `to`   | `ScaleRange` | `{ min: 0, max: 1 }` | Output range |

#### Methods

| Method              | Returns  | Description                                           |
| ------------------- | -------- | ----------------------------------------------------- |
| `scale(n)`          | `number` | Maps a value from the input range to the output range |
| `value()`           | `number` | Returns the last scaled value                         |
| `setRanges(opts)`   | `void`   | Updates input and/or output ranges                    |
| `reset(opts)`       | `void`   | Resets with new range options                         |
| `Scale.scale(opts)` | `Scale`  | Static factory, alternative to `new`                  |

---

### Fold

Folds (reflects) values back and forth within a configured range. Where `clamp` stops at the boundary and `wrap` teleports through it, `fold` bounces off it.

```typescript
import { Fold } from '@prtcl/plonk';

const f = new Fold({ min: 0, max: 10 });

f.fold(12); // 8  (overshot by 2, reflects back)
f.fold(15); // 5
f.fold(-3); // 3  (reflects upward)

// Produces a zigzag pattern
Array.from({ length: 7 }, (_, i) => f.fold(i * 5));
// [0, 5, 10, 5, 0, 5, 10]
```

#### Options

| Option | Type     | Default | Description |
| ------ | -------- | ------- | ----------- |
| `min`  | `number` | `0`     | Lower bound |
| `max`  | `number` | `1`     | Upper bound |

#### Methods

| Method                   | Returns  | Description                                                   |
| ------------------------ | -------- | ------------------------------------------------------------- |
| `fold(n)`                | `number` | Folds a value into the configured range and caches the result |
| `value()`                | `number` | Returns the last folded value                                 |
| `setRange({ min, max })` | `void`   | Updates the range bounds                                      |
| `Fold.fold(opts?)`       | `Fold`   | Static factory, alternative to `new`                          |

---

### Wrap

Wraps values around a configured range using modular arithmetic. When the value exceeds the boundary, it reappears on the other side.

```typescript
import { Wrap } from '@prtcl/plonk';

const w = new Wrap({ min: 0, max: 10 });

w.wrap(12); // 2  (wraps past max)
w.wrap(-3); // 7  (wraps below min)

// Circular sequence
Array.from({ length: 8 }, (_, i) => w.wrap(i * 3));
// [0, 3, 6, 9, 2, 5, 8, 1]
```

#### Options

| Option | Type     | Default | Description |
| ------ | -------- | ------- | ----------- |
| `min`  | `number` | `0`     | Lower bound |
| `max`  | `number` | `1`     | Upper bound |

#### Methods

| Method                   | Returns  | Description                                                   |
| ------------------------ | -------- | ------------------------------------------------------------- |
| `wrap(n)`                | `number` | Wraps a value into the configured range and caches the result |
| `value()`                | `number` | Returns the last wrapped value                                |
| `setRange({ min, max })` | `void`   | Updates the range bounds                                      |
| `Wrap.wrap(opts?)`       | `Wrap`   | Static factory, alternative to `new`                          |

---

### Slew

Constant-time linear interpolation processor. When a new value is set via `setValue`, the output smoothly transitions from the current position to the target over the configured duration. Useful for sample-and-hold smoothing, parameter glides, and portamento effects.

```typescript
import { Slew } from '@prtcl/plonk';
import { Frames } from '@prtcl/plonk';

const slew = new Slew({ duration: 500, value: 0 });

const frames = new Frames(() => {
  console.log(slew.next()); // smoothly approaches target
});

frames.run();

// Set a new target — interpolation begins from current position
slew.setValue(1);

// Change the glide time independently
slew.setDuration(1000);
```

#### Options

| Option     | Type     | Default | Description                 |
| ---------- | -------- | ------- | --------------------------- |
| `duration` | `number` | `0`     | Interpolation duration (ms) |
| `value`    | `number` | `0`     | Initial value               |

#### Methods

| Method            | Returns   | Description                                              |
| ----------------- | --------- | -------------------------------------------------------- |
| `value()`         | `number`  | Returns the current interpolated value                   |
| `next()`          | `number`  | Advances the interpolation and returns the current value |
| `done()`          | `boolean` | Returns true when the target has been reached            |
| `setValue(n)`     | `void`    | Sets a new target, interpolating from current position   |
| `setDuration(ms)` | `void`    | Updates the interpolation duration                       |
| `reset(opts?)`    | `void`    | Resets with optional new options                         |

---

### Integrator

Exponential integrator which continuously smooths toward a target value. Uses frame-rate compensated one-pole filtering, so it behaves consistently regardless of tick rate. Useful for smoothing noisy inputs, creating inertial responses, and building feedback systems.

```typescript
import { Integrator } from '@prtcl/plonk';
import { Frames } from '@prtcl/plonk';

const smooth = new Integrator({ factor: 0.1 });

const frames = new Frames(() => {
  // Smoothly chases the target
  console.log(smooth.next(100));
});

frames.run();

// Call without arguments to continue toward the last target
smooth.next();

// Adjust responsiveness on the fly
smooth.setFactor(0.5);
```

#### Options

| Option   | Type     | Default | Description                                                |
| -------- | -------- | ------- | ---------------------------------------------------------- |
| `factor` | `number` | `0.1`   | Smoothing factor between 0 and 1. Lower values are smoother |
| `value`  | `number` | `0`     | Initial value                                              |

#### Methods

| Method           | Returns  | Description                                              |
| ---------------- | -------- | -------------------------------------------------------- |
| `value()`        | `number` | Returns the current smoothed value                       |
| `next(target?)`  | `number` | Advances toward the target and returns the smoothed value |
| `setFactor(n)`   | `void`   | Updates the smoothing factor (0-1)                       |

---

### Sine

Time-based sine wave oscillator that outputs values between -1 and 1.

```typescript
import { Sine } from '@prtcl/plonk';
import { Frames } from '@prtcl/plonk';

const sine = new Sine({ duration: 2000 }); // 2-second cycle

const frames = new Frames(() => {
  const val = sine.next(); // -1...1...-1 over 2 seconds
  console.log(val);
});

frames.run();
```

#### Options

| Option     | Type     | Default | Description                     |
| ---------- | -------- | ------- | ------------------------------- |
| `duration` | `number` | —       | Duration of one full cycle (ms) |

#### Methods

| Method            | Returns  | Description                                   |
| ----------------- | -------- | --------------------------------------------- |
| `value()`         | `number` | Returns the current oscillator value          |
| `next()`          | `number` | Advances the oscillator and returns the value |
| `setDuration(ms)` | `void`   | Updates the cycle duration                    |
| `reset(opts?)`    | `void`   | Resets the oscillator                         |

---

## Utilities

### clamp

Constrains a value to a min/max range.

```typescript
import { clamp } from '@prtcl/plonk';

clamp(10, -1, 1); // 1
clamp(-5, 0, 100); // 0
clamp(0.5); // 0.5 (default range 0-1)
clamp(50, 100); // 50  (range 0-100)
```

**Signature:** `clamp(n, min?, max?) → number`

---

### expo

Raises a 0...1 value by Euler's number to produce a natural-feeling exponential curve.

```typescript
import { expo } from '@prtcl/plonk';

expo(0); // 0
expo(0.5); // ~0.176
expo(1); // 1
```

**Signature:** `expo(n) → number`

---

### sigmoid

Normalized sigmoid curve which maps 0...1 → 0...1, for use as a transfer function or waveshaper. The steepness parameter `k` controls the shape — higher values produce a more aggressive S-curve, while k = 0 is linear.

```typescript
import { sigmoid } from '@prtcl/plonk';

sigmoid(0); // 0
sigmoid(0.25); // ~0.173 (pulled toward 0)
sigmoid(0.5); // 0.5
sigmoid(0.75); // ~0.827 (pulled toward 1)
sigmoid(1); // 1

// Gentle curve
sigmoid(0.25, 2); // ~0.216

// Aggressive S-curve
sigmoid(0.25, 20); // ~0.018
```

**Signature:** `sigmoid(n, k?) → number`

| Param | Type     | Default | Description               |
| ----- | -------- | ------- | ------------------------- |
| `n`   | `number` | —       | Input value (clamped 0-1) |
| `k`   | `number` | `5`     | Steepness of the curve    |

---

### tanh

Normalized tanh curve which maps -1...1 → -1...1, for use as a transfer function or waveshaper. The steepness parameter `k` controls saturation — higher values push the curve toward hard clipping at the edges, while k = 0 is linear.

```typescript
import { tanh } from '@prtcl/plonk';

tanh(0); // 0
tanh(0.5); // ~0.987 (saturates quickly)
tanh(-0.5); // ~-0.987
tanh(1); // 1

// Gentler saturation
tanh(0.5, 2); // ~0.762

// Near-linear
tanh(0.5, 0); // 0.5
```

**Signature:** `tanh(n, k?) → number`

| Param | Type     | Default | Description                  |
| ----- | -------- | ------- | ---------------------------- |
| `n`   | `number` | —       | Input value (clamped -1...1) |
| `k`   | `number` | `5`     | Steepness of the curve       |

---

### ms

Converts time format strings or numeric values to their corresponding value in milliseconds.

```typescript
import { ms } from '@prtcl/plonk';

ms('60fps'); // 16.6667
ms('2s'); // 2000
ms('100ms'); // 100
ms('1.5m'); // 90000
ms('0.5h'); // 1800000
ms('440hz'); // 2.2727

ms(60, 'fps'); // 16.6667
ms(2, 's'); // 2000
```

**Signature:** `ms(val, format?) → number`

**Supported formats:** `fps`, `hz`, `ms`, `s`, `m`, `h`

---

### now

Cross-environment high-resolution timestamp. Uses `performance.now` when available, falls back to `process.hrtime` or `Date.now`.

```typescript
import { now } from '@prtcl/plonk';

const start = now();
// ...do work...
const elapsed = now() - start;
```

**Signature:** `now() → number`

---

### wait

The classic promisified timeout.

```typescript
import { wait } from '@prtcl/plonk';

await wait(1000); // pause for 1 second

// Useful for sequencing generators
const d = new Drunk({ min: 10, max: 100 });
for (let i = 0; i < 10; i++) {
  await wait(d.next());
  console.log(i);
}
```

**Signature:** `wait(time) → Promise<void>`

---

## React Hooks

### useMetro

Hook wrapper for `Metro`, autostart begins on mount and stops on unmount.

```typescript
import { useMetro } from '@prtcl/plonk-hooks';

function Ticker() {
  const [count, setCount] = useState(0);

  useMetro(() => {
    setCount((c) => c + 1);
  }, { time: 1000 });

  return <div>{count}</div>;
}
```

#### Options

| Option      | Type      | Default  | Description                 |
| ----------- | --------- | -------- | --------------------------- |
| `time`      | `number`  | `~16.67` | Interval between ticks (ms) |
| `autostart` | `boolean` | `true`   | Start the timer on mount    |

**Returns:** `Metro` — the underlying timer instance.

---

### useFrames

Hook wrapper for `Frames`, autostart begins on mount and stops on unmount.

```typescript
import { useRef } from 'react';
import { useFrames } from '@prtcl/plonk-hooks';

function Animation() {
  const ref = useRef<HTMLDivElement>(null);

  useFrames((timer) => {
    if (ref.current) {
      const progress = Math.min(timer.state.totalElapsed / 1000, 1);
      ref.current.style.opacity = `${progress}`;
    }
  });

  return <div ref={ref}>{/* ... */}</div>;
}
```

#### Options

| Option      | Type             | Default | Description                  |
| ----------- | ---------------- | ------- | ---------------------------- |
| `fps`       | `15 \| 30 \| 60` | `60`    | Target frames per second     |
| `autostart` | `boolean`        | `true`  | Start the animation on mount |

**Returns:** `Frames` — the underlying timer instance.

---

### usePrevious

Returns the previous value of a variable without causing additional renders.

```typescript
import { usePrevious } from '@prtcl/plonk-hooks';

function Counter({ count }: { count: number }) {
  const prevCount = usePrevious(count);

  return (
    <div>
      Current: {count}, Previous: {prevCount}
    </div>
  );
}
```

**Signature:** `usePrevious<T>(value: T) → T | undefined`

---

### Memoized Hooks

Plonk also provides memoized wrappers for the following classes as a convenience. Each accepts the same options as the underlying class, so the choice is down to use case or preference.

```typescript
import { useDrunk, useScale } from '@prtcl/plonk-hooks';

function RandomWalk() {
  const d = useDrunk({ min: -1, max: 1, step: 0.1 });
  const s = useScale({
    from: { min: -1, max: 1 },
    to: { min: 0, max: 200 },
  });

  console.log(s.scale(d.next()));

  //...
}
```

| Hook       | Options required? | Returns |
| ---------- | ----------------- | ------- |
| `useDrunk` | No                | `Drunk` |
| `useRand`  | No                | `Rand`  |
| `useEnv`   | Yes               | `Env`   |
| `useSine`  | Yes               | `Sine`  |
| `useScale` | No                | `Scale` |
| `useFold`  | No                | `Fold`  |
| `useWrap`  | No                | `Wrap`  |

---

## Composition Examples

### Dust Generator

Classic noise generator using a drunk walk with randomized intervals:

```typescript
import { useState } from 'react';
import { Drunk, Rand } from '@prtcl/plonk';
import { useMetro } from '@prtcl/plonk-hooks';

const d = new Drunk({ min: -1, max: 1 });
const r = new Rand({ min: 50, max: 150 });

function useDust() {
  const [value, setValue] = useState(() => d.value());

  useMetro(
    () => {
      setValue(d.next());
    },
    { time: r.next() }
  );

  return value;
}
```

### Envelope-Controlled Animation

Fade in an element over 2 seconds using an envelope driven by a frame loop:

```typescript
import { useFrames, useEnv } from '@prtcl/plonk-hooks';

function FadeIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const env = useEnv({ duration: 2000, from: 0, to: 1 });

  useFrames((timer) => {
    if (ref.current) {
      ref.current.style.opacity = `${env.next()}`;
    }
    if (env.done()) {
      timer.stop();
    }
  });

  return <div ref={ref}>{children}</div>;
}
```

### Sine-Modulated Position

Smoothly oscillate an element's position using a sine wave:

```typescript
import { useFrames, useSine, useScale } from '@prtcl/plonk-hooks';

function Oscillator() {
  const ref = useRef<HTMLDivElement>(null);
  const sine = useSine({ duration: 3000 });
  const scale = useScale({
    from: { min: -1, max: 1 },
    to: { min: 0, max: 200 },
  });

  useFrames(() => {
    if (ref.current) {
      ref.current.style.transform = `translateX(${scale.scale(sine.next())}px)`;
    }
  });

  return <div ref={ref}>~</div>;
}
```
