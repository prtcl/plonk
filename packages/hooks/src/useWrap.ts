import { useMemo } from 'react';
import { Wrap, type WrapOptions } from '@prtcl/plonk';

/**
 * Hook wrapper for Wrap, instantiates a Wrap transformer on mount.
 * @param opts - {@link WrapOptions} for configuring the range.
 * @returns The underlying Wrap instance.
 */
export const useWrap = (opts?: WrapOptions) => {
  return useMemo(() => new Wrap(opts), []);
};
