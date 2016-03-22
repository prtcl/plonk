
# plonk

plonk is a JavaScript micro-library that provides creative coding essentials like timers, envelopes, and random generators. It is designed to work independently of any specific medium or framework; in Node, the browser, or web workers.

Check out the [docs](doc/) for more info.

## Installation

`npm install plonk`

`bower install plonk`

You can then ```var plonk = require('plonk')```, or use the UMD browser build at ```dist/plonk[.min].s```.

If you're using Browserify and don't want to include the whole library, it is safe to cherrypick methods from `lib/`:

`var drunk = require('plonk/lib/math/drunk');`

## Dependencies

plonk uses [promise](https://github.com/then/promise) to ensure native Promise compatibility.
