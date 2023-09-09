import now from '../now';
import wait from '../wait';

describe('now', () => {
  it('returns a time offset from env start time using performance.now or fallbacks', async () => {
    const start = now();

    expect(typeof start).toBe('number');

    await wait(10);

    const offset = now();
    const elapsed = offset - start;

    expect(elapsed).toBeGreaterThanOrEqual(10);
    expect(elapsed).toBeLessThanOrEqual(30);
  });
});
