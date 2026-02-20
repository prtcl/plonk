import { describe, it, expect } from 'vitest';
import { Env } from '../env';

describe('Env', () => {
  it('starts idle and does not advance until start() is called', () => {
    const e = new Env({ from: 0, to: 1, duration: 100 });

    expect(e.value()).toEqual(0);
    expect(e.state.isRunning).toEqual(false);
    expect(e.next()).toEqual(0);
  });

  it('interpolates a value over time and notifies when complete', () => {
    const e = new Env({ duration: 100 });

    expect(e.value()).toEqual(0);

    e.start();

    let prev = 0;
    const timerId = setInterval(() => {
      prev = e.value();
      const val = e.next();

      expect(val).toBeGreaterThan(prev);

      if (e.done()) {
        clearInterval(timerId);
        expect(e.value()).toEqual(1);
        expect(e.state.isRunning).toEqual(false);
      }
    }, 10);
  });

  it('allows reversing the from and to inputs', () => {
    const e = new Env({ from: 1, to: 0, duration: 100 });

    expect(e.value()).toEqual(1);

    e.start();

    let prev = 2;
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
    expect(e.state.isRunning).toEqual(false);

    e.start();

    return new Promise<void>((done) => {
      setTimeout(() => {
        expect(e.next()).toEqual(500);
        expect(e.done()).toEqual(true);

        done();
      }, 25);
    });
  });

  it('applies curvature to the interpolation', () => {
    const linear = new Env({ from: 0, to: 1, duration: 100, curve: 1 });
    const easeIn = new Env({ from: 0, to: 1, duration: 100, curve: 2 });

    linear.start();
    easeIn.start();

    return new Promise<void>((done) => {
      setTimeout(() => {
        const linVal = linear.next();
        const easeVal = easeIn.next();

        expect(easeVal).toBeLessThan(linVal);
        expect(easeVal).toBeGreaterThan(0);

        done();
      }, 50);
    });
  });

  it('supports ease-out curvature', () => {
    const linear = new Env({ from: 0, to: 1, duration: 100, curve: 1 });
    const easeOut = new Env({ from: 0, to: 1, duration: 100, curve: 0.5 });

    linear.start();
    easeOut.start();

    return new Promise<void>((done) => {
      setTimeout(() => {
        const linVal = linear.next();
        const easeVal = easeOut.next();

        expect(easeVal).toBeGreaterThan(linVal);

        done();
      }, 50);
    });
  });

  it('re-triggers via start() without changing options', () => {
    const e = new Env({ from: 0, to: 1, duration: 50 });

    e.start();

    return new Promise<void>((done) => {
      setTimeout(() => {
        e.next();
        expect(e.done()).toEqual(true);
        expect(e.state.isRunning).toEqual(false);
        expect(e.value()).toEqual(1);

        e.start();

        expect(e.done()).toEqual(false);
        expect(e.state.isRunning).toEqual(true);
        expect(e.value()).toEqual(0);

        done();
      }, 60);
    });
  });

  it('updates output range via setFromTo', () => {
    const e = new Env({ from: 0, to: 1, duration: 50 });

    e.setFromTo(-300, 750);
    e.start();

    return new Promise<void>((done) => {
      setTimeout(() => {
        const val = e.next();

        expect(val).toBeGreaterThanOrEqual(-300);
        expect(val).toBeLessThanOrEqual(750);

        // Let it complete
        setTimeout(() => {
          e.next();
          expect(e.done()).toEqual(true);
          expect(e.value()).toEqual(750);

          done();
        }, 60);
      }, 25);
    });
  });

  it('cleans up isRunning when setDuration completes the envelope early', () => {
    const e = new Env({ from: 0, to: 1, duration: 200 });
    e.start();

    return new Promise<void>((done) => {
      setTimeout(() => {
        e.next();
        expect(e.state.isRunning).toEqual(true);

        e.setDuration(10);
        expect(e.done()).toEqual(true);
        expect(e.state.isRunning).toEqual(true);

        e.next();
        expect(e.state.isRunning).toEqual(false);
        expect(e.value()).toEqual(1);

        done();
      }, 50);
    });
  });

  it('interpolates across negative ranges', () => {
    const e = new Env({ from: -300, to: 750, duration: 200 });

    expect(e.value()).toEqual(-300);

    e.start();

    let first = true;
    return new Promise<void>((done) => {
      const timerId = setInterval(() => {
        const val = e.next();

        if (first) {
          // First tick should be near from
          expect(val).toBeGreaterThanOrEqual(-300);
          expect(val).toBeLessThan(-200);
          first = false;
        }

        expect(val).toBeGreaterThanOrEqual(-300);
        expect(val).toBeLessThanOrEqual(750);

        if (e.done()) {
          clearInterval(timerId);
          expect(e.value()).toEqual(750);

          done();
        }
      }, 10);
    });
  });
});
