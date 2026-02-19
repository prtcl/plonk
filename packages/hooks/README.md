# @prtcl/plonk-hooks

React hook wrappers for [`@prtcl/plonk`](https://www.npmjs.com/package/@prtcl/plonk). Manages timer lifecycle on mount/unmount and provides memoized instances of plonk's generators for use in components.

## Installation

```
npm i @prtcl/plonk @prtcl/plonk-hooks
```

Requires React 17–19 as a peer dependency.

## Hooks

**Timers** — `useMetro`, `useFrames` — lifecycle-managed timer loops

**Generators** — `useDrunk`, `useRand`, `useEnv`, `useSine`, `useScale`, `useFold`, `useWrap` — memoized instances of the corresponding plonk classes

**Utilities** — `usePrevious` — tracks the previous value of a variable

## Quick example

```typescript
import { useRef } from 'react';
import { useFrames, useEnv } from '@prtcl/plonk-hooks';

function FadeIn({ children }) {
  const ref = useRef(null);
  const env = useEnv({ duration: 2000, from: 0, to: 1 });

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
