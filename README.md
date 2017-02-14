
# plonk

plonk is a JavaScript micro-library that provides creative coding essentials like timers, envelopes, and random generators. It is designed to work independently of your medium or framework; in Node, the browser, or web workers.

## Usage

plonk is on [npm](https://www.npmjs.com/package/plonk) and [Bower](https://bower.io/search/?q=plonk). 

Node/Browserify:

```javascript
var plonk = require('plonk');
plonk.ms('60s');
// => 60000
```

ES6/Rollup/Webpack:

```javascript
import { ms } from 'plonk';
ms('60s');
// => 60000
```

Or, grab the UMD build from [dist](dist/) and:

```html
<script src="plonk.umd[.min].js"></script>
```
