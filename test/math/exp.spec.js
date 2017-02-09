
import test from 'tape';

import exp from '../../src/math/exp';

test('math/exp', (t) => {
  t.equal(typeof exp, 'function', 'exp is a function');

  const arr = [
    { i: -1, o: 0 },
    { i: 0, o: 0 },
    { i: 0.25, o: 0.023090389875362178 },
    { i: 0.5, o: 0.15195522325791297 },
    { i: 0.75, o: 0.45748968090533415 },
    { i: 1, o: 1 },
    { i: 2, o: 1 }
  ];

  arr.forEach((d) => {
    var n = exp(d.i);
    t.ok(n === d.o, `exp(${d.i}) equals ${d.o}`);
  });

  t.end();
});
