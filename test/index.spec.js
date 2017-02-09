
import test from 'tape';

import plonk from '../lib';

test('plonk', (t) => {

  const METHODS = [
    'clamp',
    'defer',
    'delay',
    'drunk',
    'dust',
    'env',
    'exp',
    'frames',
    'metro',
    'ms',
    'now',
    'rand',
    'scale',
    'sine',
    'wait',
    'walk'
  ];

  METHODS.forEach((name) => {
    t.equal(typeof plonk[name], 'function', `plonk.${name} is a function`);
  });

  t.end();
});
