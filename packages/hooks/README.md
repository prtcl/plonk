# @prtcl/plonk-hooks

React hook wrappers for [`@prtcl/plonk`](https://www.npmjs.com/package/@prtcl/plonk). Manages timer lifecycle on mount/unmount so you can use plonk's timers and generators directly in components.

## Installation

```
npm i @prtcl/plonk @prtcl/plonk-hooks
```

Requires React 17–19 as a peer dependency.

## Hooks

- **`useMetro`** — interval-based timer loop
- **`useFrames`** — `requestAnimationFrame`-based loop
- **`usePrevious`** — tracks the previous value of a variable

## Quick example

```typescript
import { useRef } from 'react';
import { Env } from '@prtcl/plonk';
import { useFrames } from '@prtcl/plonk-hooks';

const env = new Env({ duration: 2000, from: 0, to: 1 });

function FadeIn({ children }) {
  const ref = useRef(null);

  const frames = useFrames(() => {
    if (ref.current) {
      ref.current.style.opacity = `${env.next()}`;
    }
    if (env.done()) {
      frames.stop();
    }
  });

  return <div ref={ref}>{children}</div>;
}
```

## Documentation

See the full [API Reference](https://github.com/prtcl/plonk/blob/main/docs/API.md).
