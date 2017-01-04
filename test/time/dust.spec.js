
import test from 'tape';
import Promise from 'promise';

import dust from '../../lib/time/dust';
import now from '../../lib/util/now';

test('timers/dust', (t) => {
  t.equal(typeof dust, 'function', 'dust is a function');
  t.ok(dust(10) instanceof Promise, 'dust() returns a Promise');

  var start = now();
  dust(10, 100, (interval, i, stop) => {
    t.ok(i >= 0 && i <= 9, `${i} is in 0...9`);
    t.equal(typeof stop, 'function', 'stop is a function');
    t.ok(interval >= 10 && interval <= 100, `${interval} is in 10...100`);

    if (i === 9) {
      stop();
    }
  })
  .progress((interval) => {
    t.ok(interval >= 10 && interval <= 100, `${interval} is in 10...100`);
  })
  .then((elapsed) => {
    t.ok(elapsed <= start + (100 * 10), `${elapsed} is less than ${start + (100 * 10)}`);
    t.end();
  });

});
