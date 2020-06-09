'use strict';

const { sleep } = require('mz-modules');

describe('test/index.test.js', () => {

  it('should work', async () => {
    require('..');
    await sleep('5s');
  });
});
