import { Rand } from '../math/Rand';

describe('Rand', () => {
  it('produces random numbers within a set range', () => {
    const r = new Rand({ min: -1, max: 1 });

    expect(r.value()).toBeGreaterThanOrEqual(-1);
    expect(r.value()).toBeLessThanOrEqual(1);

    let val = r.next();

    expect(val).toBeGreaterThanOrEqual(-1);
    expect(val).toBeLessThanOrEqual(1);
    expect(r.value()).toEqual(val);

    r.setRange({ min: 0, max: 1 });

    expect(r.value()).toBeGreaterThanOrEqual(0);
    expect(r.value()).toBeLessThanOrEqual(1);

    val = r.next();

    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThanOrEqual(1);
  });

  it('has a static method which returns the result of next()', () => {
    const val = Rand.rand({ max: 1 });

    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThanOrEqual(1);
  });
});
