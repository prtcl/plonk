
import test from 'tape';

import delay from '../src/delay';
import now from '../src/now';
import Promise from '../src/_Promise';
import rand from '../src/rand';

test('delay', (t) => {
  t.equal(typeof delay, 'function', 'delay is a function');

  try {
    delay();
  } catch (err) {
    t.ok(err instanceof TypeError, err.message);
  }

  let p = delay(0, (a, b, c, d) => d());

  t.ok(p instanceof Promise, 'delay() returns a Promise');

  t.end();
});

test('delay (callback)', (t) => {

  let prev = now();

  delay(50, (interval, i, elapsed, stop) => {
    if (i === 0) {
      t.equal(typeof stop, 'function', 'stop is a function');

      t.ok(now() >= prev, `tick: ${now()} is greater than ${prev}`);
      t.ok(interval === 0, `tick: ${interval} equals 0`);
      t.ok(i === 0, `tick: ${i} equals 0`);
      t.ok(elapsed === 0, `tick: ${elapsed} equals 0`);
    } else {
      t.ok(now() >= prev + 10, `tick: ${now()} is greater than ${prev + 10}`);
      t.ok(interval >= 10 && interval <= 110, `tick: ${interval} is in 10...110`);
      t.ok(i >= 0 && i <= 9, `tick: ${i} is in 0...9`);
      t.ok(elapsed >= (i * 10) && elapsed <= (i * 110), `tick: ${elapsed} is in 0...${(i * 110)}`);
    }

    prev = now();

    if (i === 9) {
      stop();
      t.end();
    }

    return rand(10, 100);
  });

});

test('delay (promise)', (t) => {
  t.plan(5);

  let err = new Error();
  let interval = 0;
  let elapsed = 0;
  let count = 0;

  delay(0, (int, i, elpsd, stop) => {
    interval = int;
    elapsed = elpsd;

    if (i === 2) {
      stop();
    }
  })
  .progress((n) => {
    t.equal(n, interval, 'n equals interval');
  })
  .then((n) => {
    t.equal(n, elapsed, 'n equals elapsed');

    return delay(0, () => {
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
