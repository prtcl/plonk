
import Promise from 'promise/lib/es6-extensions';
import test from 'tape';

import wait from '../../src/time/wait';

test('time/wait', (t) => {
  t.equal(typeof wait, 'function', 'wait is a function');
  t.ok(wait() instanceof Promise, 'wait() returns a Promise');

  wait(1)
    .then((elapsed) => {
      t.ok(elapsed >= 0 && elapsed <= 10, `then: ${elapsed} is in 0...10`);

      return wait(10);
    })
    .then((elapsed) => {
      t.ok(elapsed >= 10 && elapsed <= 20, `then: ${elapsed} is in 10...20`);

      return wait(100);
    })
    .then((elapsed) => {
      t.ok(elapsed >= 100 && elapsed <= 110, `then: ${elapsed} is in 100...110`);

      t.end();
    });

});
