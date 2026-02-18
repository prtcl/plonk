import { describe, it, expect } from 'vitest';
import { Sine } from '../sine';

describe('Sine', () => {
  it('creates a sine wave generator which emits -1...1 values', () => {
    const s = new Sine({ duration: 500 });

    expect(s.value()).toEqual(0);

    return new Promise<void>((done) => {
      let movedAfterFirstCycle = false;
      const timerId = setInterval(() => {
        const val = s.next();

        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);

        if (s.state.totalElapsed > s.state.duration && val !== 0) {
          movedAfterFirstCycle = true;
        }

        if (s.state.totalElapsed >= s.state.duration * 2) {
          clearInterval(timerId);

          expect(movedAfterFirstCycle).toEqual(true);
          done();
        }
      }, 10);
    });
  });

  it('allows resetting state', () => {
    const s = new Sine({ duration: 100 });

    expect(s.value()).toEqual(0);

    s.reset({
      duration: 10,
    });

    expect(s.value()).toEqual(0);

    return new Promise<void>((done) => {
      setTimeout(() => {
        const val = s.next();

        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);

        done();
      }, 25);
    });
  });
});
