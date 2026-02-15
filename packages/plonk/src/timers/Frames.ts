import { ms, TimeFormat, type FPS } from '../utils/ms';
import { Metro, type TimerCallback, type MetroOptions } from './Metro';

/** Options for configuring a Frames timer. */
export type FramesOptions = {
  /** Target frames per second (15, 30, or 60). Defaults to 60. */
  fps: FPS;
};

export const DEFAULT_FPS: FPS = 60;

export const parseOptions = (opts?: FramesOptions): MetroOptions => {
  const { fps } = {
    fps: DEFAULT_FPS,
    ...opts,
  };

  return {
    time: ms(fps, TimeFormat.FPS),
  };
};

/**
 * Animation-loop timer that uses requestAnimationFrame when available.
 * @param callback - {@link TimerCallback} called on each frame tick.
 * @param opts - {@link FramesOptions} for configuring the target frame rate.
 */
export class Frames extends Metro {
  protected declare _timerId: ReturnType<typeof requestAnimationFrame>;

  constructor(callback: TimerCallback<Frames>, opts?: FramesOptions) {
    super(() => callback(this), parseOptions(opts));
  }

  protected asyncHandler(callback: () => void) {
    if (typeof window === 'undefined' || !('requestAnimationFrame' in window)) {
      super.asyncHandler(callback);
    } else {
      this._timerId = requestAnimationFrame(callback);
    }
  }

  protected clearAsyncHandler() {
    if (typeof window === 'undefined' || !('cancelAnimationFrame' in window)) {
      super.clearAsyncHandler();
    } else {
      cancelAnimationFrame(this._timerId);
    }
  }

  setFPS = (fps = DEFAULT_FPS) => {
    this.setTime(ms(fps, TimeFormat.FPS));
  };
}
