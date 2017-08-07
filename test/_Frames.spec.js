
import test from 'tape';

import animationFrame from '../src/_animationFrame';
import now from '../src/now';
import Frames from '../src/_Frames';

const SIXTY_FPS = 1000 / 60;

test('Frames', (t) => {
  t.equal(typeof Frames, 'function', 'Frames is a function');

  let ti;

  try {
    ti = Frames();
  } catch (err) {
    t.ok(err instanceof Error, err.message);
  }

  try {
    ti = new Frames();
  } catch (err) {
    t.ok(err instanceof TypeError, err.message);
  }

  ti = new Frames(-1, () => 0);

  t.equal(ti.time, 0, 'Frames#time equals 0');
  t.equal(ti._initialTime, 0, 'Frames#_initialTime equals 0');

  ti = new Frames(100, () => 0);

  t.equal(ti.time, 100, 'Frames#time equals 100');
  t.equal(ti._initialTime, 100, 'Frames#_initialTime equals 100');

  let k;
  ti = new Frames(k, () => 0, null);

  t.equal(ti.time, SIXTY_FPS, `Frames#time equals ${SIXTY_FPS}`);
  t.equal(ti._initialTime, SIXTY_FPS, `Frames#_initialTime equals ${SIXTY_FPS}`);

  ti = new Frames(() => 0);

  t.equal(ti._tickHandler, animationFrame, `_tickHandler is ${animationFrame.name}`);
  t.equal(ti._timeOffset, -5, '_timeOffset equals -5');
  t.equal(ti._prev, 0, 'Frames#_prev equals 0');
  t.equal(ti.isRunning, false, 'Frames#isRunning equals false');
  t.equal(ti.elapsed, 0, 'Frames#elapsed equals 0');
  t.equal(ti.iterations, 0, 'Frames#iterations equals 0');
  t.equal(ti.interval, 0, 'Frames#interval equals 0');
  t.equal(ti.time, SIXTY_FPS, `Frames#time equals ${SIXTY_FPS}`);
  t.equal(ti._initialTime, SIXTY_FPS, `Frames#_initialTime equals ${SIXTY_FPS}`);

  const METHODS = [
    '_callback',
    '_callTickHandler',
    '_tickHandler',
    'run',
    'stop',
    'reset',
    'setTime'
    ];

  METHODS.forEach((name) => {
    t.equal(typeof ti[name], 'function', `Frames#${name} is a function`);
  });

  t.end();

});

test('Frames (methods)', (t) => {

  let ti, ret;

  ti = new Frames(() => 0);

  ret = ti.run();

  t.deepEqual(ti, ret, 'Frames#run returns this');
  t.equal(ti.isRunning, true, 'Frames#run sets isRunning to true');
  t.ok(ti._prev > 0, 'Frames#_prev is greater than 0');

  let time = ti.time;

  ret = ti.setTime(time);
  t.deepEqual(ti, ret, 'Frames#setTime returns this');

  ti.setTime(null);
  t.ok(ti.time === time && ti._initialTime === time, 'Frames#setTime(null) sets time to _initialTime');

  time = 100;
  ti.setTime(time);
  t.ok(ti.time === time && ti._initialTime === time, `Frames#setTime(${time}) sets time to ${time}`);

  ti.setTime(-1);
  t.ok(ti.time === 0 && ti._initialTime === 0, 'Frames#setTime(-1) sets time to 0');

  let elpsd = ti.stop();

  t.ok(typeof elpsd === 'number' && elpsd === ti.elapsed, 'Frames#stop returns elapsed');
  t.equal(ti.isRunning, false, 'Frames#stop sets isRunning to false');

  ti = new Frames(() => 0);
  ti.run();

  setTimeout(() => {
    ti.reset();

    t.equal(ti._prev, 0, 'Frames#reset sets _prev to 0');
    t.equal(ti.elapsed, 0, 'Frames#reset sets elapsed to 0');
    t.equal(ti.iterations, 0, 'Frames#reset sets iterations to 0');
    t.equal(ti.interval, 0, 'Frames#reset sets interval to 0');
    t.equal(ti.time, SIXTY_FPS, `Frames#reset sets time to ${SIXTY_FPS}`);
    t.equal(ti._initialTime, SIXTY_FPS, `Frames#reset sets _initialTime to ${SIXTY_FPS}`);

    ti.stop();

    t.end();
  }, 100);

});

test('Frames (callback)', (t) => {

  let prev = now();

  let min = Math.floor(SIXTY_FPS - 5),
      max = Math.floor(SIXTY_FPS * 3);

  let ti = new Frames((interval, i, elapsed) => {
    if (i === 0) {
      t.ok(now() >= prev, `difference ${now()} is greater than ${prev}`);
      t.ok(interval === 0, `interval ${interval} equals 0`);
    } else {
      t.ok(now() >= prev + min, `difference ${now()} is greater than ${prev + min}`);
      t.ok(interval >= min && interval <= max, `interval ${interval} is in ${min}...${max}`);
    }
    t.ok(i >= 0 && i < 20, `iterations ${i} is in 0...19`);
    t.ok(elapsed >= (i * min) && elapsed <= (i * max), `elapsed ${elapsed} is in ${(i * min)}...${(i * max)}`);

    prev = now();

    if (i === 19) {
      ti.stop();
      t.end();
    }
  });

  ti.run();

});
