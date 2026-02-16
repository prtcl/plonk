import { describe, it, expect } from 'vitest';
import { Frames } from '../frames';

describe('Frames', () => {
  it('providers a timer API which wraps requestAnimationFrame', () => {
    return new Promise<void>((done) => {
      const f = new Frames(
        ({ stop, state }) => {
          if (state.iterations === 0) {
            expect(state.iterations).toEqual(0);
            expect(state.totalElapsed).toEqual(0);
            expect(state.tickInterval).toEqual(0);
          } else {
            expect(state.iterations).toBeGreaterThanOrEqual(1);
            expect(state.totalElapsed).toBeGreaterThanOrEqual(state.iterations * 33);
            expect(state.tickInterval).toBeGreaterThanOrEqual(33);
            expect(state.tickInterval).toBeLessThanOrEqual(66);
          }

          if (state.iterations === 10) {
            stop();
            done();
          }
        },
        { fps: 30 }
      );

      f.run();
    });
  });
});
