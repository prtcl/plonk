
import test from 'tape';

import metro from '../src/metro';
import now from '../src/now';
import Promise from '../src/_Promise';

test('metro', (t) => {
  t.equal(typeof metro, 'function', 'metro is a function');

  try {
    metro();
  } catch (err) {
    t.ok(err instanceof TypeError, err.message);
  }

  let p = metro(0, (a, b, c, d) => d());

  t.ok(p instanceof Promise, 'metro() returns a Promise');

  t.end();
});

test('metro (callback)', (t) => {

  let prev = now();

  metro(50, (interval, i, elapsed, stop) => {
    if (i === 0) {
      t.equal(typeof stop, 'function', 'stop is a function');

      t.ok(now() >= prev, `tick: ${now()} is greater than ${prev}`);
      t.ok(interval === 0, `tick: ${interval} equals 0`);
    } else {
      t.ok(now() >= prev + 50, `tick: ${now()} is greater than ${prev + 50}`);
      t.ok(interval >= 50 && interval <= 60, `tick: ${interval} is in 50...60`);
    }

    t.ok(i >= 0 && i <= 9, `tick: ${i} is in 0...9`);
    t.ok(elapsed >= (i * 50) && elapsed <= (i * 60), `tick: ${elapsed} is in ${(i * 50)}...${(i * 60)}`);

    prev = now();

    if (i === 9) {
      stop();
      t.end();
    }
  });

});

test('metro (promise)', (t) => {
  t.plan(4);

  let err = new Error();
  let count = 0;

  metro(0, (int, i, elpsd, stop) => {
    if (i === 1) {
      stop(1);
    }

    return 0;
  })
  .progress((n) => {
    t.equal(n, 0, 'n equals 0');
  })
  .then((n) => {
    t.equal(n, 1, 'n equals 1');

    return metro(0, () => {
      count++;
      throw err;
    });
  })
  .then(() => 1)
  .catch((e) => {
    t.deepEqual(e, err, 'throw in callback is pased down promise chain');
  })
  .then(() => {
    setTimeout(() => {
      t.equal(count, 1, 'throw in callback stops timer');
    }, 20);
  });

});
