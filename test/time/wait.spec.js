
import test from 'tape';

import { _Promise } from '../../src/util/defer';
import wait from '../../src/time/wait';

test('time/wait', (t) => {
  t.equal(typeof wait, 'function', 'wait is a function');
  t.ok(wait() instanceof _Promise, 'wait() returns a promise');

  wait()
    .then((elapsed) => {
      t.ok(elapsed >= 0 && elapsed <= 10, `then: ${elapsed} is in 0...10`);

      return wait(50);
    })
    .then((elapsed) => {
      t.ok(elapsed >= 50 && elapsed <= 60, `then: ${elapsed} is in 50...60`);

      return wait(500);
    })
    .then((elapsed) => {
      t.ok(elapsed >= 500 && elapsed <= 510, `then: ${elapsed} is in 500...510`);

      t.end();
    });

});
