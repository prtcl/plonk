
import test from 'tape';

import { _Promise } from '../../src/util/defer';
import sine from '../../src/time/sine';

test('time/sine', (t) => {
  t.equal(typeof sine, 'function', 'sine is a function');

  const p = sine(250, (val, cycle, elapsed, stop) => {
    t.ok(val >= -1 && val <= 1, `tick: ${val.toString()} is in -1...1`);

    if (elapsed >= 250 && cycle === 0) {
      t.ok(cycle === 0, 'tick: cycle equals 0');

      stop();
    } else {
      t.ok(cycle === elapsed, `tick: ${cycle} equals ${elapsed}`);
    }

    if (elapsed === 0) {
      t.equal(typeof stop, 'function', 'tick: stop is a function');
    }
  });

  t.ok(p instanceof _Promise, 'sine() returns a promise');

  p
    .progress((val) => {
      t.ok(val >= -1 && val <= 1, `progress: ${val.toString()} is in -1...1`);
    })
    .then(() => {
      t.end();
    });

});
