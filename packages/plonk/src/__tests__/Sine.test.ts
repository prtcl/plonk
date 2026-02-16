import { describe, it, expect } from 'vitest';
import { Sine } from '../Sine';

describe('Sine', () => {
  it('creates a sine wave generator which emits -1...1 values', () => {
    const s = new Sine({ duration: 500 });

    expect(s.value()).toEqual(0);

    return new Promise<void>((done) => {
      const timerId = setInterval(() => {
        const prev = s.value();
        const val = s.next();

        expect(val !== prev).toEqual(true);
        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);

        if (s.state.duration <= s.state.totalElapsed) {
          clearInterval(timerId);

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
