
import test from 'tape';

import now from '../../lib/util/now';
import Timer from '../../lib/time/timer';

test('time/timer', (t) => {
  t.equal(typeof Timer, 'function', 'Timer is a function');

  var prev = now();

  const timer = new Timer(50, (interval, i) => {
    t.ok(now() >= prev + 50, `tick: ${now()} is greater than ${prev + 50}`);
    t.ok(interval >= 50 && interval <= 60, `tick: ${interval} is in 50...60`);
    t.ok(i >= 0 && i < 20, `tick: ${i} is in 0...19`);

    prev = now();

    if (i === 19) {
      timer.stop();

      t.equal(timer.isRunning, false, 'init: isRunning equals false');
      t.equal(timer.time, 50, 'init: time equals 50');
      t.equal(timer.index, 0, 'init: index equals 0');
      t.equal(timer.interval, 0, 'init: interval equals 0');
      t.equal(timer.prev, 0, 'init: prev equals 0');

      t.end();
    }
  });

  t.equal(timer.isRunning, false, 'init: isRunning equals false');
  t.equal(timer.time, 50, 'init: time equals 50');
  t.equal(timer.index, 0, 'init: index equals 0');
  t.equal(timer.interval, 0, 'init: interval equals 0');
  t.equal(timer.prev, 0, 'init: prev equals 0');

  ['callback', 'run', 'tick', 'stop', 'clear'].forEach((name) => {
    t.equal(typeof timer[name], 'function', `init: ${name} is a function`);
  });

  timer.run();

});
