
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const pkg = require('./package.json');

const banner = `/*
 * ${pkg.name} - v${pkg.version}
 * (c) ${pkg.author} ${(new Date()).getYear()}
 */
`;

export default {
  banner,
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: ['es2015-rollup'],
      plugins: [
        ['transform-runtime', {
          helpers: false,
          polyfill: true,
          regenerator: true,
          moduleName: 'babel-runtime'
        }]
      ]
    }),
    resolve({
      module: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ],
  targets: [
    {
      dest: 'dist/plonk.es.js',
      format: 'es'
    },
    {
      dest: 'dist/plonk.js',
      format: 'umd',
      moduleId: 'plonk',
      moduleName: 'plonk'
    }
  ]
};
