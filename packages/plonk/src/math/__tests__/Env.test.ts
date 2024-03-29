import Env from '../Env';

describe('Env', () => {
  it('interpolates a value over time and notifies when complete', () => {
    const e = new Env({ from: 0, to: 1, duration: 100 });
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

      if (e.hasFinished()) {
        clearInterval(timerId);
      }
    }, 10);
  });

  it('allows resetting state', (done) => {
    const e = new Env({ from: 0, to: 1, duration: 100 });

    expect(e.value()).toEqual(0);

    e.reset({
      duration: 10,
      from: 100,
      to: 500,
    });

    expect(e.value()).toEqual(100);
    expect(e.hasFinished()).toEqual(false);

    setTimeout(() => {
      expect(e.next()).toEqual(500);
      expect(e.hasFinished()).toEqual(true);

      done();
    }, 25);
  });

  it('returns the target to value after duration has elapsed', () => {
    const e = new Env({ from: 0, to: 1, duration: 0 });

    expect(e.value()).toEqual(1);
    expect(e.next()).toEqual(1);
  });
});
