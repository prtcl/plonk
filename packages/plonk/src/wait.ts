/**
 * Promisified setTimeout.
 * @param time - Delay in milliseconds.
 * @returns A promise that resolves after the delay.
 */
export function wait(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}
