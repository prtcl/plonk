
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
import metro from 'plonk/metro';

// CommonJS
const plonk = require('plonk');
const metro = require('plonk/metro');
```

## License

MIT

Copyright © 2017 Cory O'Brien
