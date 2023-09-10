import { useEffect, useMemo, useRef } from 'react';
import { Metro, type MetroOptions, type TimerCallback } from 'plonk';
import usePrevious from '../internal/usePrevious';

const useMetro = (callback: TimerCallback<Metro>, opts?: MetroOptions) => {
  const callbackRef = useRef<TimerCallback<Metro>>(callback);
  const optsRef = useRef<MetroOptions>(opts);
  const prevOpts = usePrevious(opts);

  callbackRef.current = callback;

  const metro = useMemo<Metro>(() => {
    return new Metro((m) => {
      callbackRef.current(m);
    }, optsRef.current);
  }, []);

  useEffect(() => {
    if (opts && prevOpts && opts.time !== prevOpts.time) {
      metro.setTime(opts.time);
    }
  }, [opts, prevOpts, metro]);

  useEffect(() => {
    metro.run();
  }, [metro]);

  return metro;
};

export default useMetro;
