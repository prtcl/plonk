
import test from 'tape';

import Promise from '../src/_Promise';
import wait from '../src/wait';

test('wait', (t) => {
  t.equal(typeof wait, 'function', 'wait is a function');
  t.ok(wait() instanceof Promise, 'wait() returns a promise');

  wait()
    .then((elapsed) => {
      t.ok(elapsed >= 0 && elapsed <= 30, `elapsed ${elapsed} is in 0...30`);

      return wait(50);
    })
    .then((elapsed) => {
      t.ok(elapsed >= 49 && elapsed <= 80, `elapsed ${elapsed} is in 49...80`);

      return wait(500);
    })
    .then((elapsed) => {
      t.ok(elapsed >= 499 && elapsed <= 530, `elapsed ${elapsed} is in 499...530`);

      t.end();
    });

});
