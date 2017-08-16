
# plonk

JavaScript micro-library that provides timers, envelopes, and random generators.

Cool things about plonk:

* Time-based functions that return promises.
* Time reporting (e.g. intervals and elapsed time) via performance.now().
* Identical API and behavior in the browser, web workers, and Node.

Check out the [docs](docs.md) for more.

## Usage

```
$ npm install plonk
```

```javascript
// ES6
import plonk from 'plonk';
import { metro } from 'plonk';

// CommonJS
const plonk = require('plonk');
```

Or, the oldest school:

```
$ cp node_modules/plonk/plonk[.min].js path/to/scripts/
```
```html
<script src="path/to/scripts/plonk[.min].js"></script>
```

## License

MIT

Copyright © 2017 Cory O'Brien
