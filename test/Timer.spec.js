
import test from 'tape';

import now from '../src/now';
import Timer from '../src/Timer';

const SIXTY_FPS = 1000 / 60;

test('Timer', (t) => {
  t.equal(typeof Timer, 'function', 'Timer is a function');

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

  t.equal(ti.time, 0, 'Timer#time equals 0');
  t.equal(ti._initialTime, 0, 'Timer#_initialTime equals 0');

  ti = new Timer(100, () => 0);

  t.equal(ti.time, 100, 'Timer#time equals 100');
  t.equal(ti._initialTime, 100, 'Timer#_initialTime equals 100');

  let k;
  ti = new Timer(k, () => 0, null);

  t.equal(ti.time, SIXTY_FPS, `Timer#time equals ${SIXTY_FPS}`);
  t.equal(ti._initialTime, SIXTY_FPS, `Timer#_initialTime equals ${SIXTY_FPS}`);

  ti = new Timer(() => 0);

  t.equal(ti._timeOffset, 0, 'Timer#_timeOffset equals 0');
  t.equal(ti._prev, 0, 'Timer#_prev equals 0');
  t.equal(ti.isRunning, false, 'Timer#isRunning equals false');
  t.equal(ti.elapsed, 0, 'Timer#elapsed equals 0');
  t.equal(ti.iterations, 0, 'Timer#iterations equals 0');
  t.equal(ti.interval, 0, 'Timer#interval equals 0');
  t.equal(ti.time, SIXTY_FPS, `Timer#time equals ${SIXTY_FPS}`);
  t.equal(ti._initialTime, SIXTY_FPS, `Timer#_initialTime equals ${SIXTY_FPS}`);

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
    t.equal(typeof ti[name], 'function', `Timer#${name} is a function`);
  });

  t.end();

});

test('Timer (methods)', (t) => {

  let ti, ret;

  ti = new Timer(() => 0);

  ret = ti.run();

  t.deepEqual(ti, ret, 'Timer#run returns this');
  t.equal(ti.isRunning, true, 'Timer#run sets isRunning to true');
  t.ok(ti._prev > 0, 'Timer#_prev is greater than 0');

  let time = ti.time;

  ret = ti.setTime(time);
  t.deepEqual(ti, ret, 'Timer#setTime returns this');

  ti.setTime(null);
  t.ok(ti.time === time && ti._initialTime === time, 'Timer#setTime(null) sets time to _initialTime');

  time = 100;
  ti.setTime(time);
  t.ok(ti.time === time && ti._initialTime === time, `Timer#setTime(${time}) sets time to ${time}`);

  ti.setTime(-1);
  t.ok(ti.time === 0 && ti._initialTime === 0, 'Timer#setTime(-1) sets time to 0');

  let elpsd = ti.stop();

  t.ok(typeof elpsd === 'number' && elpsd === ti.elapsed, 'Timer#stop returns elapsed');
  t.equal(ti.isRunning, false, 'Timer#stop sets isRunning to false');

  ti = new Timer(() => 0);
  ti.run();

  setTimeout(() => {
    ti.reset();

    t.equal(ti._prev, 0, 'Timer#reset sets _prev to 0');
    t.equal(ti.elapsed, 0, 'Timer#reset sets elapsed to 0');
    t.equal(ti.iterations, 0, 'Timer#reset sets iterations to 0');
    t.equal(ti.interval, 0, 'Timer#reset sets interval to 0');
    t.equal(ti.time, SIXTY_FPS, `Timer#reset sets time to ${SIXTY_FPS}`);
    t.equal(ti._initialTime, SIXTY_FPS, `Timer#reset sets _initialTime to ${SIXTY_FPS}`);

    ti.stop();

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
