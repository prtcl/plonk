import wait from '../wait';

describe('wait', () => {
  it('waits for a given amount of ms and returns the elapsed real time', async () => {
    const elapsed = await wait(10);

    expect(typeof elapsed).toBe('number');
    expect(elapsed).toBeGreaterThanOrEqual(10);
    expect(elapsed).toBeLessThanOrEqual(30);
  });
});
