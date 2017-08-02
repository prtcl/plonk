
import test from 'tape';

import dust from '../src/dust';
import now from '../src/now';
import Promise from '../src/_Promise';

test('dust', (t) => {
  t.equal(typeof dust, 'function', 'dust is a function');

  try {
    dust();
  } catch (err) {
    t.ok(err instanceof TypeError, err.message);
  }

  let prev = now();

  const p = dust(10, 100, (interval, i, elapsed, stop) => {
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

    if (i == 10) {
      stop();
    }
  });

  t.ok(p instanceof Promise, 'dust() returns a promise');

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
