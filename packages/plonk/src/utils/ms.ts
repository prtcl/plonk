import { MS_IN_SECOND, MS_IN_MINUTE, MS_IN_HOUR } from '../constants';

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

const sanitizeStringVal = (val: string) => val.toLocaleLowerCase().trim();

const parseStringValAndFormat = (val: string) => {
  for (let i = 0; i < FORMAT_IDENTIFIERS.length; i += 1) {
    const format = FORMAT_IDENTIFIERS[i];

    if (val.includes(format)) {
      const value = Number(val.replace(' ', '').replace(format, ''));

      return {
        format,
        value,
      };
    }
  }

  return {
    format: undefined,
    value: undefined,
  };
};

export function ms(val: string | number | undefined | null): number | undefined;
export function ms(
  val: string | number | undefined | null,
  format: AvailableTimeFormats | TimeFormat | undefined,
): number | undefined;

/** Converts a time format string into equivalent milliseconds.
 * ```
 * ms('60fps')
 * => 16.666666
 * ```
 */
export function ms(
  val: string | number | undefined | null,
  format = TimeFormat.MILLISECONDS,
): number | undefined {
  let parsedValue: number;
  let parsedFormat: AvailableTimeFormats = format;

  if (val === null || typeof val === 'undefined') {
    return undefined;
  }

  if (typeof val === 'string') {
    const parsed = parseStringValAndFormat(sanitizeStringVal(val));

    if (typeof parsed.value !== 'undefined') {
      parsedValue = parsed.value;
    }

    if (parsed.format) {
      parsedFormat = parsed.format;
    }
  } else {
    parsedValue = val;
  }

  if (Number.isNaN(val)) {
    return undefined;
  }

  const formatter = FORMATTERS.get(parsedFormat);

  if (!formatter) {
    return undefined;
  }

  return formatter(parsedValue);
}
