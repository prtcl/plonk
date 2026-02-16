import { useMemo } from 'react';
import { Env, type EnvOptions } from '@prtcl/plonk';

/**
 * Hook wrapper for Env, instantiates an Env generator on mount.
 * @param opts - {@link EnvOptions} for configuring the envelope.
 * @returns The underlying Env instance.
 */
export const useEnv = (opts: EnvOptions) => {
  return useMemo(() => new Env(opts), []);
};
