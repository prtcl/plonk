
import test from 'tape';

import Promise from '../../src/util/promise';
import wait from '../../src/time/wait';

test('time/wait', (t) => {
  t.equal(typeof wait, 'function', 'wait is a function');
  t.ok(wait() instanceof Promise, 'wait() returns a promise');

  wait()
    .then((elapsed) => {
      t.ok(elapsed >= 0 && elapsed <= 30, `then: ${elapsed} is in 0...10`);

      return wait(50);
    })
    .then((elapsed) => {
      t.ok(elapsed >= 49 && elapsed <= 70, `then: ${elapsed} is in 50...60`);

      return wait(500);
    })
    .then((elapsed) => {
      t.ok(elapsed >= 499 && elapsed <= 520, `then: ${elapsed} is in 500...510`);

      t.end();
    });

});
