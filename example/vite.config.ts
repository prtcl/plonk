import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@prtcl/plonk': path.resolve(__dirname, '../packages/plonk/src/index.ts'),
    },
  },
});
