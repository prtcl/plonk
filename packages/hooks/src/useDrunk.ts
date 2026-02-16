import { useMemo } from 'react';
import { Drunk, type DrunkOptions } from '@prtcl/plonk';

/**
 * Hook wrapper for Drunk, instantiates a Drunk generator on mount.
 * @param opts - {@link DrunkOptions} for configuring the random walk.
 * @returns The underlying Drunk instance.
 */
export const useDrunk = (opts?: DrunkOptions) => {
  return useMemo(() => new Drunk(opts), []);
};
