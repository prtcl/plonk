import { useEffect, useMemo, useRef } from 'react';
import {
  Metro,
  type MetroOptions,
  type TimerCallback,
} from '@prtcl/plonk-core';
import usePrevious from './usePrevious';

export type UseMetroOptions = MetroOptions & {
  autostart?: boolean;
};

/**
 * Hook wrapper for Metro which provides a timer loop with variable interval.
 */
const useMetro = (callback: TimerCallback<Metro>, opts?: UseMetroOptions) => {
  const { autostart = true } = opts || {};

  const callbackRef = useRef<TimerCallback<Metro>>(callback);
  const optsRef = useRef<UseMetroOptions>(opts);
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
    if (autostart) {
      metro.run();
    }

    return () => {
      metro.stop();
    };
  }, [metro]);

  return metro;
};

export default useMetro;
