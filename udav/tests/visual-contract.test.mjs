import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url));
const hash = path => createHash('sha256').update(read(path)).digest('hex');

test('every image referenced by native screens matches the browser master', () => {
  const files = ['native/App.tsx', 'native/Visual.tsx', 'native/BattleScreen.tsx', 'native/achievements.ts'];
  const assets = new Set(files.flatMap(file => [...read(file).toString().matchAll(/require\("\.\/assets\/udav\/([^"\n]+)"\)/g)].map(match => match[1])));
  assert.ok(assets.size >= 40);
  for (const asset of assets) assert.equal(hash(`native/assets/udav/${asset}`), hash(`public/assets/udav/${asset}`), asset);
});
test('native achievement names, descriptions and ordering match browser', () => {
  const browser = read('src/Prototype.tsx').toString().split('const achievements = [')[1].split('function Stickers')[0];
  const expected = [...browser.matchAll(/\{([^{}]+)\}/g)].map(match => Object.fromEntries([...match[1].matchAll(/(name|desc|art):\s*"([^"]+)"/g)].map(field => [field[1], field[2]]))).filter(item => item.art);
  const native = read('native/achievements.ts').toString().split('export const achievements = ')[1].split(' as const;')[0];
  assert.deepEqual(JSON.parse(native), expected);
});
test('font binaries are shared across native and browser', () => {
  for (const font of ['Arimo-Regular.ttf', 'Arimo-Bold.ttf', 'TitanOne-Regular.ttf']) assert.equal(hash(`native/assets/fonts/${font}`), hash(`public/assets/fonts/${font}`));
  assert.equal(hash('native/node_modules/@expo-google-fonts/dela-gothic-one/400Regular/DelaGothicOne_400Regular.ttf'), hash('public/assets/fonts/DelaGothicOne.ttf'));
});
