import Drunk from '../Drunk';

type TestCase = {
  next: number;
  value: number;
};

describe('Drunk', () => {
  it('executes a random drunk walk between min and max range', () => {
    const d = new Drunk({ min: -1, max: 1 });

    expect(d.value()).toBeGreaterThanOrEqual(-1);
    expect(d.value()).toBeLessThanOrEqual(1);

    const testCases = new Array(20).fill(0).reduce<TestCase[]>((res) => {
      const value = d.value();
      res.push({
        next: d.next(),
        value,
      });

      return res;
    }, []);

    testCases.forEach(({ value, next }) => {
      expect(Math.abs(next - value)).toBeLessThanOrEqual(0.1);
      expect(value).toBeGreaterThanOrEqual(-1);
      expect(value).toBeLessThanOrEqual(1);
      expect(next).toBeGreaterThanOrEqual(-1);
      expect(next).toBeLessThanOrEqual(1);
    });
  });

  it('allows setting a new range and step size while running', () => {
    const d = new Drunk({ min: -1, max: 1 });

    expect(d.value()).toBeGreaterThanOrEqual(-1);
    expect(d.value()).toBeLessThanOrEqual(1);

    const getConfig = (index: number) =>
      index >= 10
        ? {
            step: 0.1,
            min: -1,
            max: 1,
          }
        : {
            step: 0.2,
            min: 0,
            max: 500,
          };

    const testCases = new Array(20)
      .fill(0)
      .reduce<TestCase[]>((res, _n, index) => {
        const { min, max, step } = getConfig(index);

        d.setRange({ min, max });
        d.setStepSize({ step });

        const value = d.value();
        res.push({
          next: d.next(),
          value,
        });

        return res;
      }, []);

    testCases.forEach(({ value, next }, index) => {
      const { min, max, step } = getConfig(index);

      expect(Math.abs(next - value)).toBeLessThanOrEqual(step * max);
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThanOrEqual(max);
      expect(next).toBeGreaterThanOrEqual(min);
      expect(next).toBeLessThanOrEqual(max);
    });
  });

  it('allows resetting to a new initial state', () => {
    const d = new Drunk({ min: -1, max: 1 });

    expect(d.value()).toBeGreaterThanOrEqual(-1);
    expect(d.value()).toBeLessThanOrEqual(1);

    let value = d.next();

    expect(value).toBeGreaterThanOrEqual(-1);
    expect(value).toBeLessThanOrEqual(1);

    d.reset({
      min: 0,
      max: 5000,
      startsAt: 2500,
    });

    expect(d.value()).toEqual(2500);

    value = d.next();

    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(5000);
  });
});
