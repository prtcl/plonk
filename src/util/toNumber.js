
// Basic number formatter
// Passes value unaltered if it is a Number, converts to Number if it's a coercible String, or returns default if null, undefined, or NaN.

export default function toNumber (n, def = 0) {
  if (n === null || typeof n === 'undefined') {
    return def;
  }
  if (typeof n === 'string') {
    n = +n;
  }
  if (isNaN(n)) return def;
  if (typeof n !== 'number') {
    return def;
  }
  return n;
}
