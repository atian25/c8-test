#!/usr/bin/env node

'use strict';

const { Session } = require('inspector');
const { promisify } = require('util');
const { mkdirp, rimraf, sleep } = require('mz-modules');
const path = require('path');
const fs = require('mz/fs');
const TestExclude = require('test-exclude');

const session = new Session();
session.post = promisify(session.post);

const filter = new TestExclude({
  include: [
    '**/lib/**',
  ],
  exclude: [
    'internal/**',
    'bin/**',
  ],
});


async function run() {
  // 放在这里 require 是不正常（要注释掉下面）
  // const runner = require('../');

  session.connect();
  await session.post('Profiler.enable');
  await session.post('Profiler.startPreciseCoverage', { callCount: true, detailed: true });

  console.log('start')

  // 放在这里 require 是正常，生成的 json 里面多了 Test3 count=0
  const runner = require('../');

  await sleep('5s');

  const { result } = await session.post('Profiler.takePreciseCoverage');
  await session.post('Profiler.stopPreciseCoverage');
  await session.post('Profiler.disable');

  const baseDir = path.join(process.cwd(), 'coverage/tmp');
  const filePath = path.resolve(baseDir, `coverage-${process.pid}.json`);
  await rimraf(baseDir);
  await mkdirp(path.dirname(filePath));

  const dumpResult = result.filter(item => filter.shouldInstrument(item.url));

  await fs.writeFile(filePath, JSON.stringify({ result: dumpResult }, null, 2));
}


run().catch(console.error);
