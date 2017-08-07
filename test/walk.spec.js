
import test from 'tape';

import now from '../src/now';
import Promise from '../src/_Promise';
import walk from '../src/walk';

test('walk', (t) => {
  t.equal(typeof walk, 'function', 'walk is a function');

  let prev = now();

  walk(10, 100, (interval, i, elapsed, stop) => {
    if (i === 0) {
      t.ok(now() >= prev, `difference ${now()} is greater than ${prev}`);
      t.ok(interval === 0, `interval ${interval} equals 0`);
      t.ok(i === 0, `iterations ${i} equals 0`);
      t.ok(elapsed === 0, `elapsed ${elapsed} equals 0`);
      t.equal(typeof stop, 'function', 'stop is a function');
    } else {
      t.ok(now() >= prev + 10, `difference ${now()} is greater than ${prev + 10}`);
      t.ok(interval >= 10 && interval <= 130, `interval ${interval} is in 10...130`);
      t.ok(i >= 0 && i <= 10, `iterations ${i} is in 0...10`);
      t.ok(elapsed >= (i * 10) && elapsed <= (i * 130), `elapsed ${elapsed} is in 0...${(i * 130)}`);
    }

    prev = now();

    if (i == 10) {
      stop();
      t.end();
    }
  });

});

test('walk (promise)', (t) => {

  const p = walk(10, 100, (int, i, elpsd, stop) => {
    if (i === 10) {
      stop();
    }
  });

  t.ok(p instanceof Promise, 'walk() returns a promise');

  p
    .progress((interval) => {
      if (interval === 0) {
        t.ok(interval === 0, 'interval equals 0');
      } else {
        t.ok(interval >= 10 && interval <= 130, `interval ${interval} is in 10...130`);
      }
    })
    .then((elapsed) => {
      t.ok(elapsed >= (10 * 10) && elapsed <= (10 * 130), `elapsed ${elapsed} is in ${(10 * 10)}...${(10 * 130)}`);

      t.end();
    });

});
