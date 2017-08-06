#!/usr/bin/env node

const fs = require('fs'),
      rollup = require('rollup').rollup,
      babel = require('rollup-plugin-babel'),
      UglifyJS = require('uglify-js');

const readFile = denodeify(fs.readFile),
      writeFile = denodeify(fs.writeFile),
      copyFile = (src, dest) => readFile(src).then((res) => writeFile(dest, res));

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
  .then(() => writePackageJson())
  .then(() => copyFile('README.md', 'dist/README.md'))
  .then(() => copyFile('docs.md', 'dist/docs.md'))
  .then(() => console.log('Done'))
  .catch((err) => console.error(err));

function compileBundle (config) {

  console.log(`Building ${config.filename}`);

  return rollup({
    banner,
    entry: 'src/index.js',
    plugins: [
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
          ['es2015', {
            modules: false
          }]
        ],
        plugins: [
          'external-helpers'
        ]
      })
    ]
  })
  .then((bundle) => bundle.write({
    dest: `dist/${config.filename}`,
    format: config.format,
    moduleName: pkg.name,
    amd: { id: pkg.name }
  }));
}

function uglifyModule (filename) {

  console.log(`Uglifying ${filename}`);

  const src = `dist/${filename}`,
        dest = `dist/${filename.replace('.js', '.min.js')}`;

  return readFile(src, 'utf8')
    .then((data) => {
      const res = UglifyJS.minify(data);
      if (res.error) {
        throw res.error;
      }
      return writeFile(dest, res.code);
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

function denodeify (fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('nodeify requires a function');
  }

  return (...args) => {
    return new Promise((resolve, reject) => {
      args.push((err, res) => {
        if (err) return reject(err);
        resolve(res);
      });

      fn(...args);
    });
  };
}
