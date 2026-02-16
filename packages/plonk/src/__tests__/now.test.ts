import { describe, it, expect } from 'vitest';
import { now } from '../utils/now';

describe('now', () => {
  it('returns a time offset from env start time using performance.now or fallbacks', () => {
    return new Promise<void>((done) => {
      const start = now();

      expect(typeof start).toBe('number');

      setTimeout(() => {
        const elapsed = now() - start;

        expect(elapsed).toBeGreaterThanOrEqual(100);
        expect(elapsed).toBeLessThanOrEqual(300);

        done();
      }, 100);
    });
  });
});
