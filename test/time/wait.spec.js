
import Promise from 'promise/lib/es6-extensions';
import test from 'tape';

import wait from '../../lib/time/wait';

test('time/wait', (t) => {
  t.equal(typeof wait, 'function', 'wait is a function');
  t.ok(wait() instanceof Promise, 'wait() returns a Promise');

  wait(10)
    .then((elapsed) => {
      t.ok(elapsed >= 9, `${elapsed} is greater than 9`);

      t.end();
    });

});
