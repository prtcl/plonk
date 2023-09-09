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

      if (e.hasEnded()) {
        clearInterval(timerId);
      }
    }, 10);
  });

  it('allows resetting state', () => {
    const e = new Env({ from: 0, to: 1, duration: 100 });

    expect(e.value()).toEqual(0);

    e.reset({
      duration: 0,
      from: 100,
    });

    expect(e.value()).toEqual(100);
    expect(e.hasEnded()).toEqual(true);
  });
});
