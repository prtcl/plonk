# plonk

A library for creative time processing and randomness generation. Inspired by the time-based functions found in environments like Max and Kyma.

Each function is stateful, with a generator-like API, and you decide when to advance each step. They compose freely with each other to form data and signal chains. An example:

```typescript
import * as p from '@prtcl/plonk';

const d = new p.Drunk({ min: 0, max: 1, step: 0.05 });
const s = new p.Slew({ duration: 500 });
const sx = new p.Scale({ from: { min: 0, max: 1 }, to: { min: 20, max: 600 } });

p.frames(() => {
  s.setValue(d.next());
  const x = sx.scale(p.sigmoid(s.next()));
  // ... do something with x
});
```

## Installation

```
npm i @prtcl/plonk
```

React hooks are available as a separate package:

```
npm i @prtcl/plonk-hooks
```

The core library works in any environment — browser, server, game loop, audio worklet. The hooks package is React-only and client-only.

## What's included

**Timers** — `Metro`, `Frames` — high-resolution loops with runtime metrics

**Generators** — `Drunk`, `Rand`, `Sine`, `Env` — random walks, oscillators, envelopes

**Processors** — `Slew`, `Integrator`, `Scale`, `Fold`, `Wrap` — interpolation, smoothing, range mapping, boundary transforms

**Transfer functions** — `sigmoid`, `tanh`, `expo` — waveshaping and curvature

**Utilities** — `ms`, `clamp`, `now`, `wait` — time conversion, clamping, timestamps

## Documentation

See the full [API Reference](./docs/API.md).
