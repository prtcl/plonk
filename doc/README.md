
# plonk.js


## `plonk.constrain(value, min=0, [max=min])`

Constrains an input value to min...max range.

### Arguments

* `value` *(Number)*
* `min` *(Number)*
* `[max]` *(Number)*

### Returns

*(Number)* value if value is >= min or <= max, else min or max.

### Example

```
var constrain = require('plonk/math/constrain');
constrain(Math.random(), -1, 1);
// => 0.13917264847745225
constrain(10, 0, 1);
// => 1
```
***


# `plonk.debouce(time, callback)`

Returns a function that will only be executed once, N milliseconds after the last call.

### Arguments

* `time` *(Number)*
* `callback` *(Function)*

### Returns

*(Function)* debounced callback function.

### Example

```
var debounce = require('plonk/util/debounce');
var n = 0;
var debounced = debounce(100, function () { n++; });
for (var i = 0; i < 10; i++) {
  setTimeout(debounced, 0);
}
setTimeout(function () {
  console.log(n);
  // => 1
}, 200);
```
***

