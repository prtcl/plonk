# Plonk

Tiny library providing timers, envelopes, and random generators for creative coding, animation loops, and synthesis engines. Inspired by time-based functions from Max/MSP and SuperCollider.

## Packages

### `@prtcl/plonk` (Core)
Cross-platform utilities (client + server):
- **Timers**: `Metro`, `Frames` - time-based triggers and frame counting
- **Math/Generators**: `Drunk`, `Rand`, `Env`, `Sine`, `Scale` - random walks, envelopes, oscillators
- **Utils**: `now`, `ms`, `flip`, `clamp`, `expo` - timing and math helpers

### `@prtcl/plonk-hooks` (React)
Client-only React hooks wrapping core functionality:
- `useMetro` - interval-based effects
- `useFrames` - frame-based effects
- `usePrevious` - memoization helper

## Development

```bash
npm run build       # Build all packages (runs build in workspaces)
npm run test        # Run tests across all packages
npm run clean       # Clean node_modules and dist directories
npm run publish     # Clean, install, build, and publish all packages
```

## Publishing

Both packages use synchronized versioning. To publish:

1. Bump version in both `packages/plonk/package.json` and `packages/hooks/package.json`
2. Update `@prtcl/plonk` dependency version in hooks package
3. Run `npm run publish` from root

## Package Structure

```
packages/
  plonk/
    src/
      timers/     - Metro, Frames
      math/       - Env, Sine, Scale, Drunk, Rand
      utils/      - now, ms, flip, clamp, expo
  hooks/
    src/hooks/    - useMetro, useFrames, usePrevious
```

## Notes

- Core library is environment-agnostic (works in Node, browser, etc.)
- Hooks package uses `client-only` to prevent SSR usage
- Built with tsup (ESM + CJS + types)
- Tested with vitest (unit tests + browser tests for hooks)
- React peer dependency: `17 - 19` (updated Jan 2026 for React 19 support)
