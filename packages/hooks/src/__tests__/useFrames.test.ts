import { renderHook } from '@testing-library/react';
import { type FPS } from '@prtcl/plonk';
import useFrames from '../useFrames';

describe('useFrames', () => {
  it('wraps Metro in a memo and updates time based on props change', (done) => {
    const { rerender } = renderHook(
      ({ fps }) =>
        useFrames(
          ({ state, stop }) => {
            if (state.iterations === 0) {
              expect(state.time).toEqual(1000 / 60);
            }

            if (state.iterations >= 1) {
              expect(state.time).toEqual(1000 / 30);
              expect(state.tickInterval).toBeGreaterThanOrEqual(1000 / 30);
              expect(state.tickInterval).toBeLessThanOrEqual(1000 / 30 + 20);
            }

            if (state.iterations === 2) {
              stop();
              done();
            }
          },
          {
            fps: fps as FPS,
          },
        ),
      {
        initialProps: { fps: 60 },
      },
    );

    rerender({ fps: 30 });
  });
});
