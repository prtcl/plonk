
import test from 'tape';

import animationFrame from '../src/_animationFrame';
import Frames from '../src/_Frames';
import now from '../src/now';

const SIXTY_FPS = 1000 / 60;

test('Frames', (t) => {
  t.equal(typeof Frames, 'function', 'Frames is a function');

  var prev = now();

  const timer = new Frames(SIXTY_FPS, (interval, i, elapsed) => {

    const targetInterval = SIXTY_FPS - 5;

    if (i === 0) {
      t.ok(now() >= prev, `tick: ${now()} is greater than ${prev}`);
      t.ok(interval === 0, `tick: ${interval} equals 0`);
    } else {
      t.ok(now() >= prev + targetInterval, `tick: ${now()} is greater than ${prev + targetInterval}`);
      t.ok(interval >= targetInterval && interval <= targetInterval + 25, `tick: ${interval} is in ${targetInterval}...${targetInterval + 25}`);
    }
    t.ok(i >= 0 && i < 10, `tick: ${i} is in 0...10`);
    t.ok(elapsed >= (i * targetInterval) && elapsed <= (i * (targetInterval + 25)), `tick: ${elapsed} is in ${(i * targetInterval)}...${(i * (targetInterval + 25))}`);

    prev = now();

    if (i === 9) {
      let finished = timer.stop();

      t.equal(finished, elapsed, 'stop: stop() returns final elapsed time');
      t.ok(elapsed >= targetInterval * 9 && elapsed <= (targetInterval + 25) * 9, `stop: ${elapsed} is in ${targetInterval * 9}...${(targetInterval + 25) * 9}`);

      setTimeout(() => {
        t.equal(timer.isRunning, false, 'reset: isRunning equals false');
        t.equal(timer.elapsed, 0, 'reset: elapsed equals 0');
        t.equal(timer.iterations, 0, 'reset: iterations equals 0');
        t.equal(timer.interval, 0, 'reset: interval equals 0');
        t.equal(timer._prev, 0, 'reset: _prev equals 0');
        t.equal(timer.time, timer._initialTime, `reset: time equals ${timer._initialTime}`);

        t.end();
      }, 0);
    }
  });

  t.equal(timer._tickHandler, animationFrame, '_tickHandler is animationFrame');
  t.equal(timer._timeOffset, -5, '_timeOffset equals -5');
  t.equal(timer.isRunning, false, 'init: isRunning equals false');
  t.equal(timer.elapsed, 0, 'init: elapsed equals 0');
  t.equal(timer.iterations, 0, 'init: iterations equals 0');
  t.equal(timer.interval, 0, 'init: interval equals 0');
  t.equal(timer._prev, 0, 'init: _prev equals 0');
  t.equal(timer.time, SIXTY_FPS, `init: time equals ${SIXTY_FPS}`);

  ['_callback', '_callTickHandler', '_tickHandler', 'run', 'stop', 'reset'].forEach((name) => {
    t.equal(typeof timer[name], 'function', `init: ${name} is a function`);
  });

  timer.run();

});
