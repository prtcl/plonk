
import promisesAplusTests from 'promises-aplus-tests';

import Deferred from '../src/Deferred';

const adapter = {
  deferred () {
    return new Deferred();
  }
};

promisesAplusTests(adapter, (err) => {
  if (err) {
    console.error(err);
  }
});
