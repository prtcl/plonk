
import test from 'tape';

import now from '../../lib/util/now';
import Timer from '../../lib/time/timer';

test('time/timer', (t) => {
  t.equal(typeof Timer, 'function', 'Timer is a function');

  var prev = now();

  const timer = new Timer(50, (interval, i) => {
    if (i === 0) {
      t.ok(now() >= prev, `tick: ${now()} is greater than ${prev}`);
      t.ok(interval === 0, `tick: ${interval} equals 0`);
    } else {
      t.ok(now() >= prev + 50, `tick: ${now()} is greater than ${prev + 50}`);
      t.ok(interval >= 50 && interval <= 60, `tick: ${interval} is in 50...60`);
    }
    t.ok(i >= 0 && i < 20, `tick: ${i} is in 0...19`);

    prev = now();

    if (i === 19) {
      let elapsed = timer.stop();

      t.ok(elapsed >= 950 && elapsed <= 1150, `stop: ${elapsed} is in 1000...1200`);

      setTimeout(() => {
        t.equal(timer.isRunning, false, 'reset: isRunning equals false');
        t.equal(timer.elapsed, 0, 'reset: elapsed equals 0');
        t.equal(timer.index, 0, 'reset: index equals 0');
        t.equal(timer.interval, 0, 'reset: interval equals 0');
        t.equal(timer.prev, 0, 'reset: prev equals 0');
        t.equal(timer.time, timer.initialTime, `reset: time equals ${timer.initialTime}`);

        t.end();
      }, 0);
    }
  });

  t.equal(timer.isRunning, false, 'init: isRunning equals false');
  t.equal(timer.elapsed, 0, 'init: elapsed equals 0');
  t.equal(timer.index, 0, 'init: index equals 0');
  t.equal(timer.interval, 0, 'init: interval equals 0');
  t.equal(timer.prev, 0, 'init: prev equals 0');
  t.equal(timer.time, 50, 'init: time equals 50');

  ['callback', 'run', 'tick', 'stop', 'reset'].forEach((name) => {
    t.equal(typeof timer[name], 'function', `init: ${name} is a function`);
  });

  timer.run();

});
