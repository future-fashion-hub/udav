import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createStrokeDetector, decayProgress } from '../src/battle-motion.ts';

test('requires an alternating vertical stroke, ignores noise and repeated direction', () => {
  const stroke = createStrokeDetector();
  assert.equal(stroke(0.4, 0), false);
  assert.equal(stroke(8, 100), false);
  assert.equal(stroke(9, 150), false);
  assert.equal(stroke(-8, 300), true);
  assert.equal(stroke(8, 350), false);
  assert.equal(stroke(-8, 600), true);
});
test('isolated opposite bumps and non-finite readings do not score', () => {
  const stroke = createStrokeDetector();
  assert.equal(stroke(NaN, 0), false);
  assert.equal(stroke(8, 100), false);
  assert.equal(stroke(-8, 1500), false);
});
test('decay respects grace period, elapsed time and zero floor', () => {
  assert.equal(decayProgress(50, 100, 400), 50);
  assert.equal(decayProgress(50, 100, 600), 49.65);
  assert.equal(decayProgress(50, 1000, 1550), 43);
  assert.equal(decayProgress(2, 1000, 1550), 0);
});
test('native and preview use identical detector/decay rules', () => {
  assert.equal(readFileSync(new URL('../native/battle-motion.ts', import.meta.url), 'utf8').replaceAll('\r', ''),
    readFileSync(new URL('../src/battle-motion.ts', import.meta.url), 'utf8').replaceAll('\r', ''));
});
