import { useEffect, useMemo, useRef } from 'react';
import { Metro, type MetroOptions, type TimerCallback } from '@prtcl/plonk';
import { usePrevious } from './usePrevious';

export type UseMetroOptions = MetroOptions & {
  autostart?: boolean;
};

/**
 * Hook wrapper for Metro, autostart begins on mount and stops on unmount.
 * @param callback - {@link TimerCallback} called on each tick.
 * @param opts - {@link UseMetroOptions} for configuring the timer and autostart.
 * @returns The underlying Metro instance.
 */
export const useMetro = (callback: TimerCallback<Metro>, opts?: UseMetroOptions) => {
  const { autostart = true } = opts || {};
  const callbackRef = useRef<TimerCallback<Metro>>(callback);
  const optsRef = useRef<UseMetroOptions | undefined>(opts);
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
