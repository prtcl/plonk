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
npm i plonk
yarn add plonk
```

The library is built as ES modules and split into sub-packages:

```typescript
import { Drunk } from 'plonk';
import { useMetro } from 'plonk/hooks';
import { clamp } from 'plonk/utils';
```

## Documentation

Coming soon!
