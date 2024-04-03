import { ms, TimeFormat, type FPS } from '@prtcl/plonk-utils';
import Metro, { type TimerCallback, type MetroOptions } from './Metro';

export type FramesOptions = {
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

export default class Frames extends Metro {
  protected _timerId: ReturnType<typeof requestAnimationFrame>;

  constructor(callback: TimerCallback<Frames>, opts?: FramesOptions) {
    super(callback, parseOptions(opts));
  }

  asyncHandler(callback: () => void) {
    if (typeof window === 'undefined') {
      super.asyncHandler(callback);
    } else {
      this._timerId = requestAnimationFrame(callback);
    }
  }

  clearAsyncHandler() {
    if (typeof window === 'undefined') {
      super.clearAsyncHandler();
    } else {
      cancelAnimationFrame(this._timerId);
    }
  }

  setFPS = (fps = DEFAULT_FPS) => {
    this.setTime(ms(fps, TimeFormat.FPS));
  };
}
