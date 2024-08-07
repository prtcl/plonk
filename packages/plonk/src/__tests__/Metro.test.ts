import { describe, it, expect } from 'vitest';
import { now } from '../utils/now';
import { Metro } from '../timers/Metro';

describe('Metro', () => {
  it('providers a timer API with run and stop methods', () => {
    const start = now();

    return new Promise<void>((done) => {
      const m = new Metro(
        ({ stop, state }) => {
          if (state.iterations === 0) {
            expect(state.totalElapsed).toEqual(0);
            expect(state.tickInterval).toEqual(0);
          } else {
            expect(state.totalElapsed).toBeGreaterThanOrEqual(
              state.iterations * 30,
            );
            expect(state.tickInterval).toBeGreaterThanOrEqual(30);
            expect(state.tickInterval).toBeLessThanOrEqual(55);
          }

          expect(state.prev).toBeGreaterThanOrEqual(start);
          expect(state.isRunning).toEqual(true);
          expect(state.time).toEqual(30);
          expect(state.initialTime).toEqual(30);

          if (state.iterations === 9) {
            stop();
            done();
          }
        },
        { time: 30 },
      );

      m.run();
    });
  });

  it('allows setting a new interval time while running', () => {
    return new Promise<void>((done) => {
      const m = new Metro(
        ({ stop, setTime, state }) => {
          if (state.iterations === 4) {
            setTime(50);
          }

          if (state.iterations === 0) {
            expect(state.tickInterval).toEqual(0);
          } else if (state.iterations >= 5) {
            expect(state.tickInterval).toBeGreaterThanOrEqual(50);
            expect(state.tickInterval).toBeLessThanOrEqual(75);
          } else {
            expect(state.tickInterval).toBeGreaterThanOrEqual(30);
            expect(state.tickInterval).toBeLessThanOrEqual(55);
          }

          if (state.iterations === 10) {
            stop();
            done();
          }
        },
        { time: 30 },
      );

      m.run();
    });
  });

  it('allows resetting timer state', () => {
    return new Promise<void>((done) => {
      let loops = 0;

      const m = new Metro(
        ({ stop, reset, state }) => {
          if (loops === 0) {
            reset();
          }

          loops += 1;

          if (loops === 1) {
            expect(state.iterations).toEqual(0);
            expect(state.totalElapsed).toEqual(0);
            expect(state.tickInterval).toEqual(0);

            stop();
            done();
          }
        },
        { time: 30 },
      );

      m.run();
    });
  });
});
