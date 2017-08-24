
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

  t.equal(ti._state.time, 0, 'Frames#_state.time equals 0');
  t.equal(ti._state.initialTime, 0, 'Frames#_state.initialTime equals 0');

  ti = new Frames(100, () => 0);

  t.equal(ti._state.time, 100, 'Frames#_state.time equals 100');
  t.equal(ti._state.initialTime, 100, 'Frames#_state.initialTime equals 100');

  let k;
  ti = new Frames(k, () => 0, null);

  t.equal(ti._state.time, SIXTY_FPS, `Frames#_state.time equals ${SIXTY_FPS}`);
  t.equal(ti._state.initialTime, SIXTY_FPS, `Frames#_state.initialTime equals ${SIXTY_FPS}`);

  ti = new Frames(() => 0);

  t.equal(ti._asyncHandler, animationFrame, `Frames#_asyncHandler is ${animationFrame.name}`);
  t.equal(ti._state.elapsed, 0, 'Frames#_state.elapsed equals 0');
  t.equal(ti._state.initialTime, SIXTY_FPS, `Frames#_state.initialTime equals ${SIXTY_FPS}`);
  t.equal(ti._state.interval, 0, 'Frames#_state.interval equals 0');
  t.equal(ti._state.isRunning, false, 'Frames#_state.isRunning equals false');
  t.equal(ti._state.iterations, 0, 'Frames#_state.iterations equals 0');
  t.equal(ti._state.offset, -5, 'Frames#_state.offset equals -5');
  t.equal(ti._state.prev, 0, 'Frames#_state.prev equals 0');
  t.equal(ti._state.time, SIXTY_FPS, `Frames#_state.time equals ${SIXTY_FPS}`);

  const METHODS = [
    '_callback',
    '_asyncHandler',
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

  let ret;
  const timer = new Frames(() => 0);

  ret = timer.run();

  t.deepEqual(timer, ret, 'Frames#run returns this');
  t.equal(timer._state.isRunning, true, 'Frames#run sets isRunning to true');

  let time = timer._state.time;

  ret = timer.setTime(time);
  t.deepEqual(timer, ret, 'Frames#setTime returns this');

  timer.setTime(null);
  t.ok(timer._state.time === time && timer._state.initialTime === time, 'Frames#setTime(null) sets state.time to state._initialTime');

  time = 100;
  timer.setTime(time);
  t.ok(timer._state.time === time && timer._state.initialTime === time, `Frames#setTime(${time}) sets state.time to ${time}`);

  timer.setTime(-1);
  t.ok(timer._state.time === 0 && timer._state.initialTime === 0, 'Frames#setTime(-1) sets state.time to 0');

  let elpsd = timer.stop();

  t.ok(typeof elpsd === 'number' && elpsd === timer._state.elapsed, 'Frames#stop returns state.elapsed');
  t.equal(timer._state.isRunning, false, 'Frames#stop sets isRunning to false');

  const timer2 = new Frames(() => 0);
  timer2.run();

  setTimeout(() => {
    timer2.reset();

    t.equal(timer2._state.prev, 0, 'Frames#reset sets state.prev to 0');
    t.equal(timer2._state.elapsed, 0, 'Frames#reset sets state.elapsed to 0');
    t.equal(timer2._state.iterations, 0, 'Frames#reset sets state.iterations to 0');
    t.equal(timer2._state.interval, 0, 'Frames#reset sets state.interval to 0');
    t.equal(timer2._state.time, SIXTY_FPS, `Frames#reset sets state.time to ${SIXTY_FPS}`);
    t.equal(timer2._state.initialTime, SIXTY_FPS, `Frames#reset sets state.initialTime to ${SIXTY_FPS}`);

    timer2.stop();

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
