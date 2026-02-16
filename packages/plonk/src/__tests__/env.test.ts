import { describe, it, expect } from 'vitest';
import { Env } from '../env';

describe('Env', () => {
  it('interpolates a value over time and notifies when complete', () => {
    const e = new Env({ duration: 100 });
    let loops = 0;
    let prev = 0;

    expect(e.value()).toEqual(0);

    const timerId = setInterval(() => {
      prev = e.value();
      const val = e.next();

      expect(val).toBeGreaterThan(prev);
      expect(val).toBeGreaterThanOrEqual(loops / 10);
      expect(val).toBeLessThanOrEqual(loops * 10 + 30);

      loops += 1;

      if (e.done()) {
        clearInterval(timerId);
        expect(e.value()).toEqual(1);
      }
    }, 10);
  });

  it('allows reversing the from and to inputs', () => {
    const e = new Env({ from: 1, to: 0, duration: 100 });
    let prev = 0;

    expect(e.value()).toEqual(1);

    const timerId = setInterval(() => {
      prev = e.value();
      const val = e.next();

      expect(val).toBeLessThan(prev);

      if (e.done()) {
        clearInterval(timerId);
        expect(e.value()).toEqual(0);
      }
    }, 10);
  });

  it('allows resetting state', () => {
    const e = new Env({ from: 0, to: 1, duration: 100 });

    expect(e.value()).toEqual(0);

    e.reset({
      duration: 10,
      from: 100,
      to: 500,
    });

    expect(e.value()).toEqual(100);
    expect(e.done()).toEqual(false);

    return new Promise<void>((done) => {
      setTimeout(() => {
        expect(e.next()).toEqual(500);
        expect(e.done()).toEqual(true);

        done();
      }, 25);
    });
  });

  it('returns the target to value after duration has elapsed', () => {
    const e = new Env({ from: 0, to: 1, duration: 0 });

    expect(e.value()).toEqual(1);
    expect(e.next()).toEqual(1);
  });
});
