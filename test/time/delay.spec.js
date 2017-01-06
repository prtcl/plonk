
import Promise from 'promise/lib/es6-extensions';
import test from 'tape';

import delay from '../../lib/time/delay';
import now from '../../lib/util/now';
import rand from '../../lib/math/rand';

test('time/delay', (t) => {
  t.equal(typeof delay, 'function', 'delay is a function');

  var prev = now();

  const p = delay(50, (interval, i, elapsed, stop) => {
    t.ok(now() >= prev + 10, `tick: ${now()} is greater than ${prev + 10}`);
    t.ok(interval >= 10 && interval <= 110, `tick: ${interval} is in 10...110`);
    t.ok(i >= 0 && i <= 10, `tick: ${i} is in 0...10`);
    t.ok(elapsed >= ((i + 1) * 10) && elapsed <= ((i + 1) * 110), `tick: ${elapsed} is in ${((i + 1) * 10)}...${((i + 1) * 110)}`);
    t.equal(typeof stop, 'function', 'stop is a function');

    prev = now();

    if (i < 10) {
      return rand(10, 100);
    }
    stop();
  });

  t.ok(p instanceof Promise, 'delay() returns a Promise');

  p
    .progress((interval) => {
      t.ok(interval >= 10 && interval <= 110, `progress: ${interval} is in 10...110`);
    })
    .then((elapsed) => {
      t.ok(elapsed >= (10 * 10) && elapsed <= (10 * 110), `tick: ${elapsed} is in ${(10 * 10)}...${(10 * 110)}`);

      t.end();
    });

});
