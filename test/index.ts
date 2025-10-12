/*
  test - index.ts
*/

import { randomBytes } from 'crypto';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import crc32Combine, { type Crc32Chunk } from '../src/index.ts';
import crc32 from 'buffer-crc32';

const RANDOM_TESTS = 256;
const RANDOM_MAX_LENGTH = 1024 * 1024;

test('invalid', () => {
  assert.throws(() => crc32Combine());
  assert.throws(() => crc32Combine(undefined));
  assert.throws(() => crc32Combine(null));
  assert.throws(() => crc32Combine(NaN));
  assert.throws(() => crc32Combine(Infinity));
  assert.throws(() => crc32Combine(-Infinity));
  assert.throws(() => crc32Combine(true));
  assert.throws(() => crc32Combine(false));
  assert.throws(() => crc32Combine('test'));
  assert.throws(() => crc32Combine({}));
  assert.throws(() => crc32Combine([]));
  assert.throws(() => crc32Combine([{ crc32: 1 }]));
  assert.throws(() => crc32Combine([{ crc32: null, len: 1 }]));
});

test('valid', () => {
  assert.is(crc32Combine([{ crc32: 1, len: 1 }]), 1);
  assert.is(crc32Combine([{ crc32: 1, len: 1000 }]), 1);
  assert.is(crc32Combine([{ crc32: 1, len: 1 }, { crc32: 1, len: 1 }]), 1996959895);
});

test('random', () => {
  for (let i = 0; i < RANDOM_TESTS; i++) {
    const buffer: Buffer = randomBytes(1 + Math.floor(Math.random() * RANDOM_MAX_LENGTH));
    const chunks: Crc32Chunk[] = [];
    let currentLength = 0;
    while (currentLength < buffer.length) {
      const len = 1 + Math.floor(Math.random() * (buffer.length - currentLength));
      const chunk = buffer.slice(currentLength, currentLength + len);
      chunks.push({ crc32: crc32.unsigned(chunk), len: chunk.length });
      currentLength += chunk.length;
    }
    assert.is(crc32Combine(chunks), crc32.unsigned(buffer));
  }
});

test.run();
