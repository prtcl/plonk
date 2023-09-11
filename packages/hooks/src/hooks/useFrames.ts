import { useEffect, useMemo, useRef } from 'react';
import { Frames, type FramesOptions, type TimerCallback } from 'plonk';
import usePrevious from '../internal/usePrevious';

export type UseFramesOptions = FramesOptions & {
  autostart?: boolean;
};

const useFrames = (
  callback: TimerCallback<Frames>,
  opts?: UseFramesOptions,
) => {
  const { autostart = true } = opts || {};

  const callbackRef = useRef<TimerCallback<Frames>>(callback);
  const optsRef = useRef<UseFramesOptions>(opts);
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
  }, [frames]);

  return frames;
};

export default useFrames;
