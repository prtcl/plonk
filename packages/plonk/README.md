# @prtcl/plonk

Tiny library providing timers, envelopes, and random generators for creative coding, animation loops, and synthesis engines. Inspired by time-based functions from Max/MSP and SuperCollider.

## Installation

```
npm i @prtcl/plonk
```

## What's included

- **Timers** — `Metro`, `Frames` — high-resolution recursive loops with runtime metrics
- **Generators** — `Drunk`, `Rand`, `Env`, `Sine`, `Scale` — random walks, envelopes, oscillators, and range mapping
- **Utilities** — `now`, `ms`, `clamp`, `expo`, `flip` — timing and math helpers

Generators follow an iterator-inspired `value()` / `next()` pattern — they're stateful objects you pull from on your own schedule (a timer callback, a Web Audio worklet, a game loop, etc).

## Quick example

```typescript
import { Metro, Drunk, Rand } from '@prtcl/plonk';

const d = new Drunk({ min: -1, max: 1 });
const r = new Rand({ min: 50, max: 150 });

const metro = new Metro(() => {
  console.log(d.next());
  metro.setTime(r.next());
}, { time: 100 });

metro.run();
```

## Documentation

See the full [API Reference](https://github.com/prtcl/plonk/blob/main/docs/API.md).

Also available: [`@prtcl/plonk-hooks`](https://www.npmjs.com/package/@prtcl/plonk-hooks) for React integration.
