import now from './now';

const wait = (time = 0): Promise<number> => {
  const start = now();
  return new Promise((resolve) => {
    setTimeout(() => {
      const elapsed = now() - start;
      resolve(elapsed);
    }, time);
  });
};

export default wait;
