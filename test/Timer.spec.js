
import test from 'tape';

import now from '../src/now';
import Timer from '../src/Timer';

test('Timer', (t) => {
  t.equal(typeof Timer, 'function', 'Timer is a function');

  try {
    let ti = new Timer();
  } catch (err) {
    t.ok(err instanceof TypeError, err.message);
  }

  let prev = now();

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

    if (i === 0) {
      timer.setTime(66);
      t.equal(timer.time, 66, 'timer.time equals 66');
      t.equal(timer._initialTime, 66, 'timer._initialTime equals 66');
      timer.setTime(50);
    }

    if (i === 19) {
      let finished = timer.stop();

      t.equal(finished, elapsed, 'stop: stop() returns final elapsed time');
      t.ok(elapsed >= 950 && elapsed <= 1150, `stop: ${elapsed} is in 1000...1200`);

      setTimeout(() => {
        t.equal(timer._prev, 0, 'reset: _prev equals 0');
        t.equal(timer.isRunning, false, 'reset: isRunning equals false');
        t.equal(timer.elapsed, 0, 'reset: elapsed equals 0');
        t.equal(timer.iterations, 0, 'reset: iterations equals 0');
        t.equal(timer.interval, 0, 'reset: interval equals 0');
        t.equal(timer.time, 50, 'reset: time equals 50');
        t.equal(timer._initialTime, 50, 'reset: _initialTime equals 50');

        t.end();
      }, 0);
    }
  });

  t.equal(timer._prev, 0, 'init: _prev equals 0');
  t.equal(timer.isRunning, false, 'init: isRunning equals false');
  t.equal(timer.elapsed, 0, 'init: elapsed equals 0');
  t.equal(timer.iterations, 0, 'init: iterations equals 0');
  t.equal(timer.interval, 0, 'init: interval equals 0');
  t.equal(timer.time, 50, 'init: time equals 50');
  t.equal(timer._initialTime, 50, 'init: _initialTime equals 50');

  ['_callback', '_callTickHandler', '_tickHandler', 'run', 'stop', 'reset', 'setTime'].forEach((name) => {
    t.equal(typeof timer[name], 'function', `init: ${name} is a function`);
  });

  timer.run();

});
