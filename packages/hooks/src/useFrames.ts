import { useEffect, useMemo, useRef } from 'react';
import { Frames, type FramesOptions, type TimerCallback } from '@prtcl/plonk';
import { usePrevious } from './usePrevious';

export type UseFramesOptions = FramesOptions & {
  autostart?: boolean;
};

/**
 * Hook wrapper for Frames, autostart begins on mount and stops on unmount.
 * @param callback - {@link TimerCallback} called on each frame tick.
 * @param opts - {@link UseFramesOptions} for configuring frame rate and autostart.
 * @returns The underlying Frames instance.
 */
export const useFrames = (callback: TimerCallback<Frames>, opts?: UseFramesOptions) => {
  const { autostart = true } = opts || {};
  const callbackRef = useRef<TimerCallback<Frames>>(callback);
  const optsRef = useRef<UseFramesOptions | undefined>(opts);
  const prevOpts = usePrevious(opts);

  callbackRef.current = callback;

  const frames = useMemo<Frames>(() => {
    return new Frames((m) => {
      callbackRef.current(m);
    }, optsRef.current);
  }, []);

  useEffect(() => {
    if (opts && prevOpts && opts.fps !== prevOpts.fps) {
      frames.setFPS(opts.fps);
    }
  }, [opts, prevOpts, frames]);

  useEffect(() => {
    if (autostart) {
      frames.run();
    }

    return () => {
      frames.stop();
    };
  }, [frames]);

  return frames;
};
