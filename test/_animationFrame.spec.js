
import test from 'tape';

import animationFrame from '../src/_animationFrame';

test('animationFrame', (t) => {
  t.equal(typeof animationFrame, 'function', `animationFrame is the function ${animationFrame.name}`);

  let n = 0;

  animationFrame(() => {
    n++;
    animationFrame(() => {
      n++;
      t.equal(n, 2, 'n equals 2');
      t.end();
    });
    t.equal(n, 1, 'n equals 1');
  });

  t.equal(n, 0, 'n equals 0');

});
