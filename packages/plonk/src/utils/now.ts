const now = (() => {
  if (typeof performance !== 'undefined' && 'now' in performance) {
    return () => performance.now();
  }

  if (
    typeof process === 'object' &&
    process.toString() === '[object process]'
  ) {
    const timestamp = () => {
      const hr = process.hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    const initial = timestamp();
    return () => {
      return (timestamp() - initial) / 1e6;
    };
  }

  const initial = Date.now();
  return () => {
    return Date.now() - initial;
  };
})();

export default now;
