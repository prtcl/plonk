
import test from 'tape';

import frames from '../src/frames';
import now from '../src/now';
import Promise from '../src/_Promise';

const SIXTY_FPS = 1000 / 60;

test('frames', (t) => {
  t.equal(typeof frames, 'function', 'frames is a function');

  try {
    frames();
  } catch (err) {
    t.ok(err instanceof TypeError, err.message);
  }

  let p = frames(0, (a, b, c, d) => d());

  t.ok(p instanceof Promise, 'frames() returns a Promise');

  t.end();
});

test('frames (callback)', (t) => {

  let prev = now();

  const fps = SIXTY_FPS - 5;

  frames((interval, i, elapsed, stop) => {
    if (i === 0) {
      t.equal(typeof stop, 'function', 'stop is a function');

      t.ok(now() >= prev, `tick: ${now()} is greater than ${prev}`);
      t.ok(interval === 0, `tick: ${interval} equals 0`);
    } else {
      t.ok(now() >= prev + fps, `tick: ${now()} is greater than ${prev + fps}`);
      t.ok(interval >= fps && interval <= fps + 25, `tick: ${interval} is in ${fps}...${fps + 25}`);
    }
    t.ok(i >= 0 && i < 10, `tick: ${i} is in 0...10`);
    t.ok(elapsed >= (i * fps) && elapsed <= (i * (fps + 25)), `tick: ${elapsed} is in ${(i * fps)}...${(i * (fps + 25))}`);

    prev = now();

    if (i === 9) {
      stop(20);
      t.end();
    }
  });

});

test('frames (promise)', (t) => {
  t.plan(5);

  let err = new Error();
  let interval = 0;
  let elapsed = 0;
  let count = 0;

  frames((int, i, elpsd, stop) => {
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

    return frames(() => {
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

test('frames (fps)', (t) => {

  testFps(60)
    .then(() => testFps(30))
    .then(() => testFps(10))
    .then(() => t.end());

  function testFps (fps) {
    const ms = 1000 / fps,
          min = ms - 5,
          max = ms + 20;

    return frames(fps, (int, i, elpsd, stop) => {
      if (i === 0) {
        t.equal(int, 0, '${int} equals 0');
      } else {
        t.ok(int >= min && int <= max, `${int} is in ${min}...${max}`);
      }

      if (i === 9) {
        stop();
      }
    });
  }

});
