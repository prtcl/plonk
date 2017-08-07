
import test from 'tape';

import Promise from '../src/_Promise';
import sine from '../src/sine';

test('sine', (t) => {
  t.equal(typeof sine, 'function', 'sine is a function');

  try {
    sine();
  } catch (err) {
    t.ok(err instanceof TypeError, err.message);
  }

  sine(250, (val, cycle, elapsed, stop) => {
    t.ok(val >= -1 && val <= 1, `value ${val} is in -1...1`);

    if (elapsed >= 250 && cycle === 0) {
      t.ok(cycle === 0, 'cycle equals 0');

      stop();
      t.end();
    } else {
      t.ok(cycle === elapsed, `cycle ${cycle} equals elapsed ${elapsed}`);
    }

    if (elapsed === 0) {
      t.equal(typeof stop, 'function', 'stop is a function');
    }
  });

});

test('sine (promise)', (t) => {

  const p = sine(250, (val, cycle, elapsed, stop) => {
    if (elapsed >= 250 && cycle === 0) {
      stop();
    }
  });

  t.ok(p instanceof Promise, 'sine() returns a promise');

  p
    .progress((val) => {
      t.ok(val >= -1 && val <= 1, `value ${val} is in -1...1`);
    })
    .then(() => {
      t.end();
    });

});
