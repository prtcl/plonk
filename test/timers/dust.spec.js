
import test from 'tape';
import Promise from 'promise';

import dust from '../../lib/timers/dust';
import now from '../../lib/util/now';

test('timers/dust', (t) => {
  t.equal(typeof dust, 'function', 'typeof dust === function');
  t.ok(dust(10) instanceof Promise, 'dust() instanceof Promise');

  var start = now();
  dust(10, 100, (time, i, stop) => {
    t.ok(time >= 10 && time <= 100, `${time} >= 10 && ${time} <= 100`);
    t.ok(i >= 0 && i <= 9, `${i} >= 0 && ${i} <= 9`);
    t.equal(typeof stop, 'function', 'typeof stop === function');

    if (i === 9) {
      stop();
    }
  })
  .then((elapsed) => {
    t.ok(elapsed <= start + (100 * 10), `${elapsed} <= ${start + (100 * 10)}`);
    t.end();
  });

});
