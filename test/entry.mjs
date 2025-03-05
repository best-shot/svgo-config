import { createRequire } from 'node:module';

import test from 'ava';

import js from '../lib/config.js';
import mjs from '../lib/config.mjs';

const Require = createRequire(import.meta.url);

const json = Require('../lib/config.json');
const cjs = Require('../lib/config.cjs');

test('type', (t) => {
  t.deepEqual(json, js);
  t.deepEqual(json, cjs);
  t.deepEqual(json, mjs);
});
