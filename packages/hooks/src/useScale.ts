import { useMemo } from 'react';
import { Scale, type ScaleOptions } from '@prtcl/plonk';

/**
 * Hook wrapper for Scale, instantiates a Scale mapper on mount.
 * @param opts - {@link ScaleOptions} for configuring the input/output ranges.
 * @returns The underlying Scale instance.
 */
export const useScale = (opts?: ScaleOptions) => {
  return useMemo(() => new Scale(opts), []);
};
