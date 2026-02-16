type InnerNow = () => number;

/** Resolve the best available clock once at module load. */
const innerNow = ((): InnerNow => {
  // Browser or modern Node (>= 16)
  if (typeof performance !== 'undefined' && 'now' in performance) {
    return () => performance.now();
  }

  // Older Node — use process.hrtime, offset from first call
  if (typeof process === 'object' && process.toString() === '[object process]') {
    const ts = () => {
      const hr = process.hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    const initialNow = ts();
    return () => (ts() - initialNow) / 1e6;
  }

  // Fallback — Date.now with manual offset
  const initialNow = Date.now();
  return () => Date.now() - initialNow;
})();

/**
 * Cross-environment high-resolution timestamp (performance.now polyfill).
 * @returns Elapsed milliseconds since initialization.
 */
export function now(): number {
  return innerNow();
}
