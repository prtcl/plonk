import { useMemo } from 'react';
import { Sine, type SineOptions } from '@prtcl/plonk';

/**
 * Hook wrapper for Sine, instantiates a Sine oscillator on mount.
 * @param opts - {@link SineOptions} for configuring the oscillator.
 * @returns The underlying Sine instance.
 */
export const useSine = (opts: SineOptions) => {
  return useMemo(() => new Sine(opts), []);
};
