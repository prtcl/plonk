const now = (() => {
  // For browsers just use performance.now.
  if (typeof performance !== 'undefined' && 'now' in performance) {
    return () => performance.now();
  }

  // In node emulate performance.now behavior using hrtime - offset.
  if (
    typeof process === 'object' &&
    process.toString() === '[object process]'
  ) {
    const timestamp = () => {
      const hr = process.hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    const offset = timestamp();

    return () => {
      return (timestamp() - offset) / 1e6;
    };
  }

  // Fallback just in case.
  const offset = Date.now();
  return () => {
    return Date.now() - offset;
  };
})();

export default now;
