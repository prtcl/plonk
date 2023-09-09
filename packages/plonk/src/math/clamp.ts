export function clamp(n: number): number;
export function clamp(n: number, max: number): number;
export function clamp(n: number, min: number, max: number): number;

export default function clamp(n: number, min?: number, max?: number) {
  let a = 0;
  let b = 1;

  if (typeof min === 'number') {
    if (typeof max === 'number') {
      a = min;
      b = max;
    } else {
      a = 0;
      b = min;
    }
  }

  return Math.min(Math.max(n, a), b);
}
