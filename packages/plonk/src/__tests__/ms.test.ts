import { describe, it, expect } from 'vitest';
import { ms, TimeFormat } from '../ms';

describe('ms', () => {
  it('parses string time formats to milliseconds', () => {
    expect(ms('66ms')).toEqual(66);
    expect(ms('1s')).toEqual(1000);
    expect(ms('0.875s')).toEqual(875);
    expect(ms('10s')).toEqual(10000);
    expect(ms('1m')).toEqual(60000);
    expect(ms('7h')).toEqual(25200000);
    expect(ms('1hz')).toEqual(1000);
    expect(ms('0.5hz')).toEqual(2000);
    expect(ms('2hz')).toEqual(500);
    expect(ms('60fps')).toEqual(16.666666666666668);
  });

  it('converts numeric values with explicit format', () => {
    expect(ms(100)).toEqual(100);
    expect(ms(100, TimeFormat.MILLISECONDS)).toEqual(100);
    expect(ms(1, TimeFormat.SECONDS)).toEqual(1000);
    expect(ms(1, TimeFormat.MINUTES)).toEqual(60000);
    expect(ms(7, TimeFormat.HOURS)).toEqual(25200000);
    expect(ms(1, TimeFormat.HZ)).toEqual(1000);
    expect(ms(60, TimeFormat.FPS)).toEqual(16.666666666666668);
  });

  it('throws for unparseable strings', () => {
    expect(() => ms('123abc')).toThrow();
    expect(() => ms('garbage')).toThrow();
  });
});
