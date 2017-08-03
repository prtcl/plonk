#!/usr/bin/env node

const fs = require('fs'),
      rollup = require('rollup').rollup,
      babelPlugin = require('rollup-plugin-babel'),
      babelNode = require('rollup-plugin-node-resolve'),
      commonjsPlugin = require('rollup-plugin-commonjs'),
      babel = require('babel-core'),
      UglifyJS = require('uglify-js');

const pkg = require('../package.json');

const banner = `/*
 * ${pkg.name} - v${pkg.version}
 * (c) ${pkg.author} ${(new Date()).getYear()}
 */
`;

const bundles = [
  {
    filename: 'plonk.js',
    format: 'umd'
  },
  {
    filename: 'plonk.es.js',
    format: 'es'
  }
];

Promise.all(bundles.map(compileBundle))
  .then(() => uglifyModule(bundles[0].filename))
  .then(() => getModuleFilenames())
  .then((files) => Promise.all(files.map(compileModule)))
  .then(() => writePackageJson())
  .then(() => console.log('Done'))
  .catch((err) => console.error(err));

function compileBundle (config) {

  console.log(`Building ${config.filename}`);

  return rollup({
    banner,
    entry: 'src/index.js',
    plugins: [
      babelPlugin({
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
      babelNode({
        module: true,
        main: true
      }),
      commonjsPlugin({
        include: 'node_modules/**'
      })
    ]
  })
  .then((bundle) => bundle.write({
    dest: `dist/${config.filename}`,
    format: config.format,
    moduleId: pkg.name,
    moduleName: pkg.name
  }));
}

function uglifyModule (filename) {

  console.log(`Uglifying ${filename}`);

  const src = `dist/${filename}`,
        dest = `dist/${filename.replace('.js', '.min.js')}`;

  return readFile(src)
    .then((data) => {
      const res = UglifyJS.minify(data);
      return writeFile(dest, res.code);
    });
}

function getModuleFilenames () {
  return new Promise((resolve, reject) => {
    fs.readdir('src', (err, items) => {
      if (err) return reject(err);

      const files = items
        .filter((d) => d.indexOf('js') !== -1)
        .filter((d) => d.indexOf('index') === -1)
        .sort((a, b) => a.localeCompare(b));

      resolve(files);
    });
  });
}

function compileModule (filename) {

  console.log(`Compiling ${filename}`);

  const src = `src/${filename}`,
        dest = `dist/${filename}`;

  return transformFile(src)
    .then((code) => writeFile(dest, code));
}

function transformFile (filename) {
  const options = {
    babelrc: false,
    presets: ['es2015'],
    plugins: [
      'transform-runtime',
      'add-module-exports'
    ]
  };

  return new Promise((resolve, reject) => {
    babel.transformFile(filename, options, (err, res) => {
      if (err) return reject(err);
      resolve(res.code);
    });
  });
}

function writePackageJson () {

  console.log('Writing package.json');

  const attrs = {
    name: 'plonk',
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
    license: pkg.license,
    main: 'plonk.js',
    module: 'plonk.es.js',
    repository: pkg.repository,
    dependencies: pkg.dependencies
  };

  const data = JSON.stringify(attrs, null, 2);

  return writeFile('dist/package.json', data);
}

function readFile (filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function writeFile (dest, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
