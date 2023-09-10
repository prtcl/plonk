import clamp from './clamp';

const expo = (n: number): number => {
  return Math.pow(clamp(n, 0, 1), Math.E);
};

export default expo;
