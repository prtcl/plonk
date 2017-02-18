#!/usr/bin/env node

const rollup = require('rollup').rollup;

const babel = require('rollup-plugin-babel'),
      nodeResolve = require('rollup-plugin-node-resolve'),
      commonjs = require('rollup-plugin-commonjs');

const pkg = require('../package.json');

const external = [
  'asap',
  'promise',
  'promise/lib/es6-extensions'
];

const nodeBanner = `/*
 * ${pkg.name} - v${pkg.version}
 * (c) ${pkg.author}
 * License ${pkg.license}
 */
`;

const browserBanner = `${nodeBanner}
/*
 * Includes:
 *  asap https://github.com/kriskowal/asap
 *  promise https://github.com/then/promise
 */
`;

rollup({
  entry: 'src/index.js',
  external,
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: ['es2015-rollup']
    })
  ]
})
  .then((bundle) => {
    bundle.write({
      banner: nodeBanner,
      dest: 'dist/plonk.js',
      format: 'cjs',
      moduleId: 'plonk',
      moduleName: 'plonk'
    });
  })
  .catch((err) => {
    console.error(err.stack);
  });

rollup({
  entry: 'src/index.js',
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: ['es2015-rollup']
    }),
    nodeResolve({
      module: true,
      main: true,
      browser: true
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ]
})
  .then((bundle) => {
    bundle.write({
      banner: browserBanner,
      dest: 'dist/plonk.umd.js',
      format: 'umd',
      moduleId: 'plonk',
      moduleName: 'plonk'
    });
    bundle.write({
      banner: browserBanner,
      dest: 'dist/plonk.es.js',
      format: 'es'
    });
  })
  .catch((err) => {
    console.error(err.stack);
  });
