import { now } from '../utils/now';

describe('now', () => {
  it('returns a time offset from env start time using performance.now or fallbacks', (done) => {
    const start = now();

    expect(typeof start).toBe('number');

    setTimeout(() => {
      const elapsed = now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(10);
      expect(elapsed).toBeLessThanOrEqual(30);

      done();
    }, 10);
  });
});
