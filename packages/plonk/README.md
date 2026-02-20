# @prtcl/plonk

A library for creative time processing and randomness generation. Inspired by the time-based functions found in environments like Max and Kyma.

## Installation

```
npm i @prtcl/plonk
```

## What's included

**Timers** — `Metro`, `Frames` — high-resolution loops with runtime metrics

**Generators** — `Drunk`, `Rand`, `Sine`, `Env` — random walks, oscillators, envelopes

**Processors** — `Slew`, `Integrator`, `Scale`, `Fold`, `Wrap` — interpolation, smoothing, range mapping, boundary transforms

**Transfer functions** — `sigmoid`, `tanh`, `expo` — waveshaping and curvature

**Utilities** — `ms`, `clamp`, `now`, `wait` — time conversion, clamping, timestamps

Each function is stateful, with a generator-like API, and you decide when to advance each step. They compose freely with each other to form data and signal chains.

## Quick example

```typescript
import * as p from '@prtcl/plonk';

const d = new p.Drunk({ min: 0, max: 1, step: 0.05 });
const s = new p.Slew({ duration: 500 });
const sx = new p.Scale({ from: { min: 0, max: 1 }, to: { min: 20, max: 600 } });

p.frames(({ state }) => {
  if (state.iterations % 30 === 0) s.setValue(d.next());
  const x = sx.scale(p.sigmoid(s.next()));
  // ... do something with x
});
```

## Documentation

See the full [API Reference](https://github.com/prtcl/plonk/blob/main/docs/API.md).

Also available: [`@prtcl/plonk-hooks`](https://www.npmjs.com/package/@prtcl/plonk-hooks) for React integration.
