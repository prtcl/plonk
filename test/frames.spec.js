
import test from 'tape';

import frames from '../src/frames';
import now from '../src/now';
import Promise from '../src/_Promise';

const SIXTY_FPS = 1000 / 60;

test('frames', (t) => {
  t.equal(typeof frames, 'function', 'frames is a function');

  var prev = now();

  const targetInterval = SIXTY_FPS - 5;

  const p = frames((interval, i, elapsed, stop) => {

    if (i === 0) {
      t.ok(now() >= prev, `tick: ${now()} is greater than ${prev}`);
      t.ok(interval === 0, `tick: ${interval} equals 0`);
    } else {
      t.ok(now() >= prev + targetInterval, `tick: ${now()} is greater than ${prev + targetInterval}`);
      t.ok(interval >= targetInterval && interval <= targetInterval + 25, `tick: ${interval} is in ${targetInterval}...${targetInterval + 25}`);
    }
    t.ok(i >= 0 && i < 10, `tick: ${i} is in 0...10`);
    t.ok(elapsed >= (i * targetInterval) && elapsed <= (i * (targetInterval + 25)), `tick: ${elapsed} is in ${(i * targetInterval)}...${(i * (targetInterval + 25))}`);
    t.equal(typeof stop, 'function', 'stop is a function');

    prev = now();

    if (i === 9) {
      return stop(20);
    }
  });

  t.ok(p instanceof Promise, 'frames() returns a promise');

  p
    .progress((val) => {
      t.ok(val >= 0 && val <= targetInterval + 25, `progress: ${val} is in ${targetInterval}...${targetInterval + 25}`);
    })
    .then((val) => {
      t.ok(val >= targetInterval * 9 && val <= (targetInterval + 25) * 9, `then: ${val} is in ${targetInterval * 9}...${(targetInterval + 25) * 9}`);

      t.end();
    });

});
