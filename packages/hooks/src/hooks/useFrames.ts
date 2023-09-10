import { useEffect, useMemo, useRef } from 'react';
import { Frames, type FramesOptions, type TimerCallback } from 'plonk';
import usePrevious from '../internal/usePrevious';

const useFrames = (callback: TimerCallback<Frames>, opts?: FramesOptions) => {
  const callbackRef = useRef<TimerCallback<Frames>>(callback);
  const optsRef = useRef<FramesOptions>(opts);
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
    frames.run();
  }, [frames]);

  return frames;
};

export default useFrames;
