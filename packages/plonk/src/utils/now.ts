let internal: () => number;

if (typeof performance !== 'undefined' && 'now' in performance) {
  internal = () => {
    return performance.now();
  };
} else if (
  typeof process === 'object' &&
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
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

/** performance.now polyfill for running across envs. */
export function now() {
  return internal();
}
