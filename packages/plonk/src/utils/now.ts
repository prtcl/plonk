let internal: () => number;

if (typeof performance !== 'undefined' && 'now' in performance) {
  internal = () => {
    return performance.now();
  };
} else if (
  typeof process === 'object' &&
  process.toString() === '[object process]'
) {
  const timestamp = () => {
    const hr = process.hrtime();
    return hr[0] * 1e9 + hr[1];
  };
  const initial = timestamp();

  internal = () => {
    return (timestamp() - initial) / 1e6;
  };
} else {
  const initial = Date.now();

  internal = () => {
    return Date.now() - initial;
  };
}

/**
 * Cross-environment high-resolution timestamp (performance.now polyfill).
 * @returns Elapsed milliseconds since initialization.
 */
export function now() {
  return internal();
}
