import { useMemo } from 'react';
import { Rand, type RandOptions } from '@prtcl/plonk';

/**
 * Hook wrapper for Rand, instantiates a Rand generator on mount.
 * @param opts - {@link RandOptions} for configuring the random range.
 * @returns The underlying Rand instance.
 */
export const useRand = (opts?: RandOptions) => {
  return useMemo(() => new Rand(opts), []);
};
