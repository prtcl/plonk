import ms, { TimeFormat } from '../utils/ms';

type TestCase = {
  val: string | number | undefined | null;
  format?: TimeFormat;
  res: number | undefined;
};

describe('ms', () => {
  it('formats incoming values to their millisecond equivalents based on format identifiers', () => {
    const testCases: TestCase[] = [
      {
        val: undefined,
        res: undefined,
      },
      {
        val: null,
        res: undefined,
      },
      {
        val: '123abc',
        res: undefined,
      },
      {
        val: 100,
        res: 100,
      },
      {
        val: 100,
        format: TimeFormat.MILLISECONDS,
        res: 100,
      },
      {
        val: '66ms',
        res: 66,
      },
      {
        val: 1,
        format: TimeFormat.SECONDS,
        res: 1000,
      },
      {
        val: '1s',
        res: 1000,
      },
      {
        val: '0.875s',
        res: 875,
      },
      {
        val: '10s',
        res: 10000,
      },
      {
        val: 1,
        format: TimeFormat.MINUTES,
        res: 60000,
      },
      {
        val: '1m',
        res: 60000,
      },
      {
        val: 7,
        format: TimeFormat.HOURS,
        res: 25200000,
      },
      {
        val: '7h',
        res: 25200000,
      },
      {
        val: 1,
        format: TimeFormat.HZ,
        res: 1000,
      },
      {
        val: '1hz',
        res: 1000,
      },
      {
        val: '0.5hz',
        res: 2000,
      },
      {
        val: '2hz',
        res: 500,
      },
      {
        val: 60,
        format: TimeFormat.FPS,
        res: 16.666666666666668,
      },
      {
        val: '60fps',
        res: 16.666666666666668,
      },
    ];

    testCases.forEach(({ val, format, res }) => {
      expect(ms(val, format)).toEqual(res);
    });
  });
});
