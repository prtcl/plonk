
# plonk.js

plonk is a timer and utility micro-library. It's focus is on providing timers that return [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), browser polyfills for things like requestAnimationFrame and process.nextTick, and some basic math utilities.

Many of the design decisions in plonk were inspired by creative code environments like [Max](https://cycling74.com/products/max/) and [openFrameworks](http://openframeworks.cc/). If you like working in these environments, you will feel at home with plonk.

Documentation is available in [doc/](blob/master/doc/README.md).

## Installation

```npm install plonk```

```bower install plonk```

You can then ```var plonk = require('plonk')```, or include the UMD browser build at ```dist/plonk[.min].s```.

If you're using a CommonJS environment like node or Browserify, you can also cherrypick methods without loading the whole library:

```var drunk = require('plonk/math/drunk');```

## Dependencies

In order to keep the build size small in the browser, plonk does not have any dependencies other than [lie](https://github.com/calvinmetcalf/lie), which is used to ensure native Promise compatibilty. 
