import { expect, it, describe } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMetro } from '../hooks/useMetro';

describe('useMetro', () => {
  it('wraps Metro in a memo and updates time based on props change', () => {
    return new Promise<void>((done) => {
      const { result, rerender } = renderHook(
        ({ time }) =>
          useMetro(
            ({ state, stop }) => {
              if (state.iterations === 0) {
                expect(state.time).toEqual(30);
              }

              if (state.iterations >= 1) {
                expect(state.time).toEqual(50);
                expect(state.tickInterval).toBeGreaterThanOrEqual(50);
                expect(state.tickInterval).toBeLessThanOrEqual(70);
              }

              if (state.iterations === 2) {
                stop();
                done();
              }
            },
            {
              autostart: false,
              time,
            },
          ),
        {
          initialProps: { time: 30 },
        },
      );

      act(() => {
        result.current.run();
      });

      rerender({ time: 50 });
    });
  });
});
