# Plonk

Tiny library providing timers, envelopes, and random generators for creative coding, animation loops, and synthesis engines. Inspired by time-based functions from Max/MSP and SuperCollider.

## Project philosophy

Library introduces creative coding functions and objects to Javascript, the API design is intentionally open-ended to allow for general use across client and server creative coding projects. Important is the "time primitive" concept: stateful objects operate in real-time and calculate interpolation stages across elapsed intervals.

## Packages

### `@prtcl/plonk` (Core)

Cross-platform utilities (client + server):

- **Timers**: `Metro`, `Frames` - time-based triggers and frame counting
- **Math/Generators**: `Drunk`, `Rand`, `Env`, `Sine`, `Scale`, `Fold`, `Wrap` - random walks, envelopes, oscillators, range transformers
- **Utils**: `now`, `ms`, `clamp`, `expo`, `sigmoid`, `tanh`, `wait` - timing, math helpers, and transfer functions

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

Both packages use synchronized versioning. Run `npm run publish` (or `./scripts/publish.sh`) which handles version bumping, building, testing, and publishing.

The hooks package pins `@prtcl/plonk` to an exact version in its dependencies. The `scripts/update-version.ts` script writes the new version to three locations: both `package.json` version fields and the hooks dependency. This pinned version is what gets published to the registry. npm workspaces resolves the local symlink regardless of the version string, so build and test work even when the bumped version doesn't exist on the registry yet. The `workspace:` protocol would handle this more elegantly but isn't supported by npm (it's pnpm/Yarn only).

## Package Structure

```
packages/
  plonk/src/      - All source files are flat (no subdirectories), lowercase filenames
  hooks/src/      - useMetro, useFrames, usePrevious
```

## API Pattern

Every class has a lowercase counterpart exported alongside it. Classes are the primary API — the lowercase versions are a convenience for people who prefer a terse, functional style:

- **All classes** (`drunk`, `env`, `sine`, `metro`, `frames`, `scale`, `fold`, `wrap`, `slew`): factories which return a new instance
- **Exception**: `rand` is a one-shot which returns a random number — use `new Rand()` when you need a persistent instance
- **Utils** (`clamp`, `expo`, `sigmoid`, `tanh`, `ms`, `now`, `wait`): standalone functions

The class is always the source of truth. Lowercase exports delegate to static methods on the class (e.g. `export const fold = Fold.fold`). Pure math lives in unexported `transform` functions within the same file when needed (e.g. fold.ts, wrap.ts).

## Notes

- Core library is environment-agnostic (works in Node, browser, etc.)
- Hooks package uses `client-only` to prevent SSR usage
- Built with tsup (ESM + CJS + types)
- Tested with vitest (unit tests + browser tests for hooks)
- React peer dependency: `17 - 19` (updated Jan 2026 for React 19 support)
