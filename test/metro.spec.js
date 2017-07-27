
import test from 'tape';

import metro from '../src/metro';
import now from '../src/now';
import Promise from '../src/_Promise';

test('metro', (t) => {
  t.equal(typeof metro, 'function', 'metro is a function');

  var prev = now();

  const p = metro(50, (interval, i, elapsed, stop) => {
    if (i === 0) {
      t.ok(now() >= prev, `tick: ${now()} is greater than ${prev}`);
      t.ok(interval === 0, `tick: ${interval} equals 0`);
    } else {
      t.ok(now() >= prev + 50, `tick: ${now()} is greater than ${prev + 50}`);
      t.ok(interval >= 50 && interval <= 60, `tick: ${interval} is in 50...60`);
    }
    t.ok(i >= 0 && i <= 10, `tick: ${i} is in 0...10`);
    t.ok(elapsed >= (i * 50) && elapsed <= (i * 60), `tick: ${elapsed} is in ${(i * 50)}...${(i * 60)}`);
    t.equal(typeof stop, 'function', 'stop is a function');

    prev = now();

    if (i < 10) {
      return i;
    }
    stop(20);
  });

  t.ok(p instanceof Promise, 'metro() returns a promise');

  p
    .progress((val) => {
      t.ok(val >= 0 && val < 10, `progress: ${val} is in 0...10`);
    })
    .then((val) => {
      t.ok(val === 20, `then: ${val} equals 20`);

      t.end();
    });

});
