
import test from 'tape';

import { _Promise } from '../../src/util/defer';
import delay from '../../src/time/delay';
import now from '../../src/util/now';
import rand from '../../src/math/rand';

test('time/delay', (t) => {
  t.equal(typeof delay, 'function', 'delay is a function');

  var prev = now();

  const p = delay(50, (interval, i, elapsed, stop) => {
    if (i === 0) {
      t.ok(now() >= prev, `tick: ${now()} is greater than ${prev}`);
      t.ok(interval === 0, `tick: ${interval} equals 0`);
      t.ok(i === 0, `tick: ${i} equals 0`);
      t.ok(elapsed === 0, `tick: ${elapsed} equals 0`);
      t.equal(typeof stop, 'function', 'stop is a function');
    } else {
      t.ok(now() >= prev + 10, `tick: ${now()} is greater than ${prev + 10}`);
      t.ok(interval >= 10 && interval <= 110, `tick: ${interval} is in 10...110`);
      t.ok(i >= 0 && i <= 10, `tick: ${i} is in 0...10`);
      t.ok(elapsed >= (i * 10) && elapsed <= (i * 110), `tick: ${elapsed} is in 0...${(i * 110)}`);
    }

    prev = now();

    if (i < 10) {
      return rand(10, 100);
    }
    stop();
  });

  t.ok(p instanceof _Promise, 'delay() returns a promise');

  p
    .progress((interval) => {
      if (interval === 0) {
        t.ok(interval === 0, 'progress: interval equals 0');
      } else {
        t.ok(interval >= 10 && interval <= 110, `progress: ${interval} is in 10...110`);
      }
    })
    .then((elapsed) => {
      t.ok(elapsed >= (10 * 10) && elapsed <= (10 * 110), `then: ${elapsed} is in ${(10 * 10)}...${(10 * 110)}`);

      t.end();
    });

});
