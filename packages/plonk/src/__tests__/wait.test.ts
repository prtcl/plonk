import { describe, it, expect } from 'vitest';
import { wait } from '../wait';

describe('wait', () => {
  it('resolves after the specified delay', async () => {
    const start = performance.now();
    await wait(50);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(40);
  });
});
