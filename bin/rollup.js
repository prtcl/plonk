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

const banner = `/*
 * ${pkg.name} - v${pkg.version}
 * (c) ${pkg.author}
 * License ${pkg.license}
 */
 `;

rollup({
  entry: 'src/index.js',
  external,
  plugins: [
    babel({ exclude: 'node_modules/**' })
  ]
})
  .then((bundle) => {
    bundle.write({
      banner,
      format: 'cjs',
      dest: 'dist/plonk.js',
      moduleId: 'plonk',
      moduleName: 'plonk'
    });
    bundle.write({
      banner,
      format: 'es',
      dest: 'dist/plonk.es.js'
    });
  })
  .catch((err) => {
    console.error(err.stack);
  });

rollup({
  entry: 'src/index.js',
  banner,
  plugins: [
    babel({ exclude: 'node_modules/**' }),
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
      banner,
      format: 'umd',
      dest: 'dist/plonk.umd.js',
      moduleId: 'plonk',
      moduleName: 'plonk'
    });
  })
  .catch((err) => {
    console.error(err.stack);
  });
