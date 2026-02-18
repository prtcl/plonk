import { MS_IN_SECOND, MS_IN_MINUTE, MS_IN_HOUR } from './constants';

export type FPS = 15 | 30 | 60;

export enum TimeFormat {
  FPS = 'fps',
  HOURS = 'h',
  HZ = 'hz',
  MILLISECONDS = 'ms',
  MINUTES = 'm',
  SECONDS = 's',
}

export type AvailableTimeFormats = `${TimeFormat}`;

export const FORMAT_IDENTIFIERS: AvailableTimeFormats[] = [
  TimeFormat.FPS,
  TimeFormat.HOURS,
  TimeFormat.HZ,
  TimeFormat.MILLISECONDS,
  TimeFormat.MINUTES,
  TimeFormat.SECONDS,
]
  // Desc length sort so that `ms` matches prior to `m`
  .sort((a, b) => b.length - a.length);

type FormatGetter = (val: number) => number;

const FORMATTERS = new Map<AvailableTimeFormats, FormatGetter>([
  [TimeFormat.FPS, (val: number) => MS_IN_SECOND / val],
  [TimeFormat.HOURS, (val: number) => val * MS_IN_HOUR],
  [TimeFormat.HZ, (val: number) => (1 / val) * MS_IN_SECOND],
  [TimeFormat.MILLISECONDS, (val: number) => val],
  [TimeFormat.MINUTES, (val: number) => val * MS_IN_MINUTE],
  [TimeFormat.SECONDS, (val: number) => val * MS_IN_SECOND],
]);

export function ms(val: string): number;
export function ms(val: number, format?: AvailableTimeFormats | TimeFormat): number;
/**
 * Converts time format strings or numeric values to their corresponding value in milliseconds.
 * @param value - A string like `'60fps'`, `'2s'`, or a numeric value.
 * @param format - Explicit time format when `val` is a number.
 * @returns Milliseconds.
 */
export function ms(value: string | number, format?: AvailableTimeFormats | TimeFormat): number {
  let parsedValue: number | null = null;
  let parsedFormat: AvailableTimeFormats = format || TimeFormat.MILLISECONDS;

  if (typeof value === 'string') {
    const parsed = parseValueAndFormat(value);
    if (parsed) {
      parsedValue = parsed.value;
      parsedFormat = parsed.format;
    }
  } else {
    parsedValue = value;
  }

  if (parsedValue === null) {
    throw new Error(`ms: unparseable value "${value}"`);
  }

  const formatter = FORMATTERS.get(parsedFormat);
  if (formatter) {
    return formatter(parsedValue);
  }

  return parsedValue;
}

type Parsed = {
  format: AvailableTimeFormats;
  value: number;
};

function parseValueAndFormat(value: string): Parsed | null {
  const normalized = value.toLocaleLowerCase().replace(' ', '').trim();
  for (const format of FORMAT_IDENTIFIERS) {
    if (normalized.includes(format)) {
      const parsedValue = Number(normalized.replace(format, ''));
      return {
        format,
        value: Number.isNaN(parsedValue) ? 0 : parsedValue,
      };
    }
  }

  return null;
}
