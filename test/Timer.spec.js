
import test from 'tape';

import now from '../src/now';
import Timer, { asyncHandler, tickHandler } from '../src/Timer';

const SIXTY_FPS = 1000 / 60;

test('Timer', (t) => {
  t.equal(typeof Timer, 'function', 'Timer is a function');
  t.equal(typeof asyncHandler, 'function', 'asyncHandler is a function');
  t.equal(typeof tickHandler, 'function', 'tickHandler is a function');

  let ti;

  try {
    ti = Timer();
  } catch (err) {
    t.ok(err instanceof Error, err.message);
  }

  try {
    ti = new Timer();
  } catch (err) {
    t.ok(err instanceof TypeError, err.message);
  }

  ti = new Timer(-1, () => 0);

  t.equal(ti._state.time, 0, 'Timer#_state.time equals 0');
  t.equal(ti._state.initialTime, 0, 'Timer#_state.initialTime equals 0');

  ti = new Timer(100, () => 0);

  t.equal(ti._state.time, 100, 'Timer#_state.time equals 100');
  t.equal(ti._state.initialTime, 100, 'Timer#_state.initialTime equals 100');

  let k;
  ti = new Timer(k, () => 0, null);

  t.equal(ti._state.time, SIXTY_FPS, `Timer#_state.time equals ${SIXTY_FPS}`);
  t.equal(ti._state.initialTime, SIXTY_FPS, `Timer#_state.initialTime equals ${SIXTY_FPS}`);

  ti = new Timer(() => 0);

  t.equal(ti._asyncHandler, asyncHandler, `Timer#_asyncHandler is ${asyncHandler.name}`);
  t.equal(ti._state.elapsed, 0, 'Timer#_state.elapsed equals 0');
  t.equal(ti._state.initialTime, SIXTY_FPS, `Timer#_state.initialTime equals ${SIXTY_FPS}`);
  t.equal(ti._state.interval, 0, 'Timer#_state.interval equals 0');
  t.equal(ti._state.isRunning, false, 'Timer#isRunning equals false');
  t.equal(ti._state.iterations, 0, 'Timer#_state.iterations equals 0');
  t.equal(ti._state.offset, 0, 'Timer#_state.offset equals 0');
  t.equal(ti._state.prev, 0, 'Timer#_state.prev equals 0');
  t.equal(ti._state.time, SIXTY_FPS, `Timer#_state.time equals ${SIXTY_FPS}`);

  const METHODS = [
    '_callback',
    '_asyncHandler',
    'run',
    'stop',
    'reset',
    'setTime'
    ];

  METHODS.forEach((name) => {
    t.equal(typeof ti[name], 'function', `Timer#${name} is a function`);
  });

  t.end();

});

test('Timer (methods)', (t) => {

  let ret;
  const timer = new Timer(() => 0);

  ret = timer.run();

  t.deepEqual(timer, ret, 'Timer#run returns this');
  t.equal(timer._state.isRunning, true, 'Timer#run sets isRunning to true');

  let time = timer._state.time;

  ret = timer.setTime(time);
  t.deepEqual(timer, ret, 'Timer#setTime returns this');

  timer.setTime(null);
  t.ok(timer._state.time === time && timer._state.initialTime === time, 'Timer#setTime(null) sets state.time to state._initialTime');

  time = 100;
  timer.setTime(time);
  t.ok(timer._state.time === time && timer._state.initialTime === time, `Timer#setTime(${time}) sets state.time to ${time}`);

  timer.setTime(-1);
  t.ok(timer._state.time === 0 && timer._state.initialTime === 0, 'Timer#setTime(-1) sets state.time to 0');

  let elpsd = timer.stop();

  t.ok(typeof elpsd === 'number' && elpsd === timer._state.elapsed, 'Timer#stop returns state.elapsed');
  t.equal(timer._state.isRunning, false, 'Timer#stop sets isRunning to false');

  const timer2 = new Timer(() => 0);
  timer2.run();

  setTimeout(() => {
    timer2.reset();

    t.equal(timer2._state.prev, 0, 'Timer#reset sets state.prev to 0');
    t.equal(timer2._state.elapsed, 0, 'Timer#reset sets state.elapsed to 0');
    t.equal(timer2._state.iterations, 0, 'Timer#reset sets state.iterations to 0');
    t.equal(timer2._state.interval, 0, 'Timer#reset sets state.interval to 0');
    t.equal(timer2._state.time, SIXTY_FPS, `Timer#reset sets state.time to ${SIXTY_FPS}`);
    t.equal(timer2._state.initialTime, SIXTY_FPS, `Timer#reset sets state.initialTime to ${SIXTY_FPS}`);

    timer2.stop();

    t.end();
  }, 100);

});

test('Timer (callback)', (t) => {

  let prev = now();

  let ti = new Timer((interval, i, elapsed) => {
    if (i === 0) {
      t.ok(now() >= prev, `difference ${now()} is greater than ${prev}`);
      t.ok(interval === 0, `interval ${interval} equals 0`);
    } else {
      t.ok(now() >= prev + 16, `difference ${now()} is greater than ${prev + 16}`);
      t.ok(interval >= 16 && interval <= 48, `interval ${interval} is in 16...48`);
    }
    t.ok(i >= 0 && i < 20, `iterations ${i} is in 0...19`);
    t.ok(elapsed >= (i * 16) && elapsed <= (i * 48), `elapsed ${elapsed} is in ${(i * 16)}...${(i * 48)}`);

    prev = now();

    if (i === 19) {
      ti.stop();
      t.end();
    }
  });

  ti.run();

});
