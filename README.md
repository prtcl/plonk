
# plonk.js

plonk is a micro-library that provides creative coding essentials like timers, envelopes, random number generators, and environment normalizing polyfills. It is designed to work independently of any specific medium or framework, in Node, the browser, or web workers.

Check out the [docs](blob/master/doc/) for more info.

## Installation

```npm install plonk```

```bower install plonk```

You can then ```var plonk = require('plonk')```, or include the UMD browser build at ```dist/plonk[.min].s```.

If you're using Browserify and don't want to include the whole library, you can also cherrypick methods from `lib/`:

```var drunk = require('plonk/lib/math/drunk');```

## Dependencies

plonk uses [promise](https://github.com/then/promise) to ensure native Promise compatibility.
