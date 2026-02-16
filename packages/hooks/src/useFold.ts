import { useMemo } from 'react';
import { Fold, type FoldOptions } from '@prtcl/plonk';

/**
 * Hook wrapper for Fold, instantiates a Fold transformer on mount.
 * @param opts - {@link FoldOptions} for configuring the range.
 * @returns The underlying Fold instance.
 */
export const useFold = (opts?: FoldOptions) => {
  return useMemo(() => new Fold(opts), []);
};
