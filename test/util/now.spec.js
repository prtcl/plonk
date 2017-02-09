
import test from 'tape';

import now, { performanceNowHandler } from '../../src/util/now';

test('util/now', (t) => {
  t.equal(typeof now, 'function', 'now is a function');
  t.equal(typeof now(), 'number', `${now()} is a number`);

  t.equal(typeof performanceNowHandler, 'function', 'performanceNowHandler is a function');
  t.equal(typeof performanceNowHandler(), 'number', `${performanceNowHandler()} is a number`);

  var start = now();
  setTimeout(() => {
    t.ok(now() > start, `${now()} is greater than ${start}`);
    t.end();
  }, 0);

});
