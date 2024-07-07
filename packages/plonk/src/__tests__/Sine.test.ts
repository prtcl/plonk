import { Sine } from '../math/Sine';

describe('Sine', () => {
  it('creates a sine wave generator which emits -1...1 values', (done) => {
    const s = new Sine({ duration: 500 });

    expect(s.value()).toEqual(0);

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

  it('allows resetting state', (done) => {
    const s = new Sine({ duration: 100 });

    expect(s.value()).toEqual(0);

    s.reset({
      duration: 10,
    });

    expect(s.value()).toEqual(0);

    setTimeout(() => {
      const val = s.next();

      expect(val).toBeGreaterThanOrEqual(-1);
      expect(val).toBeLessThanOrEqual(1);

      done();
    }, 25);
  });
});
