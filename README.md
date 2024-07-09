# plonk

Tiny library that provides timers, envelopes and random generators.

Cool things about plonk:

- Inspired by the time-based functions from environments like Max and SuperCollider
- Flexible API for use in animation loops, creative coding projects, synthesis engines, etc
- Cross-platform, client or server, plays well with other libs

Here's the famous dust generator using plonk:

```typescript
const d = new Drunk({ min: -1, max: 1 });
const r = new Rand({ min: 50, max: 150 });

const useDust = () => {
  const [value, setValue] = useState(() => d.value());
  useMetro(
    () => {
      setValue(d.next());
    },
    { time: r.next() },
  );

  return value;
};
```

## Installation

```
// For the core timers and random generators
npm i @prtcl/plonk 

// For React
npm i @prtcl/plonk-hooks
```

The library is built as ES modules and split into sub-packages:

```typescript
import { Drunk, clamp } from '@prtcl/plonk';
import { useMetro } from '@prtcl/plonk-hooks';
```

In general, plonk is written for both client and server usage, while hooks are React-only and client-only.

## Documentation

Coming soon!
