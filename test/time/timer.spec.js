
import test from 'tape';

import now from '../../src/util/now';
import Timer from '../../src/time/timer';

test('time/timer', (t) => {
  t.equal(typeof Timer, 'function', 'Timer is a function');

  var prev = now();

  const timer = new Timer(50, (interval, i, elapsed) => {
    if (i === 0) {
      t.ok(now() >= prev, `tick: ${now()} is greater than ${prev}`);
      t.ok(interval === 0, `tick: ${interval} equals 0`);
    } else {
      t.ok(now() >= prev + 50, `tick: ${now()} is greater than ${prev + 50}`);
      t.ok(interval >= 50 && interval <= 60, `tick: ${interval} is in 50...60`);
    }
    t.ok(i >= 0 && i < 20, `tick: ${i} is in 0...19`);
    t.ok(elapsed >= (i * 50) && elapsed <= (i * 60), `tick: ${elapsed} is in ${(i * 50)}...${(i * 60)}`);

    prev = now();

    if (i === 19) {
      let finished = timer.stop();

      t.equal(finished, elapsed, 'stop: stop() returns final elapsed time');
      t.ok(elapsed >= 950 && elapsed <= 1150, `stop: ${elapsed} is in 1000...1200`);

      setTimeout(() => {
        t.equal(timer.isRunning, false, 'reset: isRunning equals false');
        t.equal(timer.elapsed, 0, 'reset: elapsed equals 0');
        t.equal(timer.iterations, 0, 'reset: iterations equals 0');
        t.equal(timer.interval, 0, 'reset: interval equals 0');
        t.equal(timer.prev, 0, 'reset: prev equals 0');
        t.equal(timer.time, timer.initialTime, `reset: time equals ${timer.initialTime}`);

        t.end();
      }, 0);
    }
  });

  t.equal(typeof timer._tickHandler, 'function', 'init: _tickHandler is a function');
  t.equal(timer.isRunning, false, 'init: isRunning equals false');
  t.equal(timer.elapsed, 0, 'init: elapsed equals 0');
  t.equal(timer.iterations, 0, 'init: iterations equals 0');
  t.equal(timer.interval, 0, 'init: interval equals 0');
  t.equal(timer.prev, 0, 'init: prev equals 0');
  t.equal(timer.time, 50, 'init: time equals 50');

  ['callback', 'run', 'tick', 'stop', 'reset'].forEach((name) => {
    t.equal(typeof timer[name], 'function', `init: ${name} is a function`);
  });

  timer.run();

});
