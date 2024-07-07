import expo from '../utils/expo';

type TestCase = {
  from: number;
  to: number;
};

describe('expo', () => {
  it('maps a linear range of 0...1 to an exponential curve', () => {
    const testCases: TestCase[] = [
      {
        from: 0,
        to: 0,
      },
      {
        from: 0.25,
        to: 0.023090389875362178,
      },
      {
        from: 0.5,
        to: 0.15195522325791297,
      },
      {
        from: 0.75,
        to: 0.45748968090533415,
      },
      {
        from: 1,
        to: 1,
      },
    ];

    testCases.forEach(({ from, to }) => {
      expect(expo(from)).toEqual(to);
    });
  });
});
