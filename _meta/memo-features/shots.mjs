// Reshoot the screenshots on site/memo-features.md from the live site (or a preview).
//
//   node _meta/memo-features/shots.mjs                 # every shot
//   node _meta/memo-features/shots.mjs reader-menu     # one shot
//
// Env: MEMO_BASE (default https://memo.d.foundation), MEMO_SHOTS_OUT (default site/assets), MEMO_APP (a foundation-apps
// apps/memo checkout, for its Playwright), BROWSER_PATH (a Chromium binary).
// Writes site/assets/memo-features-<name>.png, builds the phone pair, runs pngquant.
// A UI change to a pictured screen reshoots its shot in the same change.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const APP = process.env.MEMO_APP ?? path.join(os.homedir(), 'workspace/dwarvesf/foundation-apps/apps/memo');
const { chromium } = createRequire(path.join(APP, 'package.json'))('@playwright/test');
const BASE = process.env.MEMO_BASE ?? 'https://memo.d.foundation';
const OUT = process.env.MEMO_SHOTS_OUT ?? path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../site/assets');
const BROWSER = process.env.BROWSER_PATH ?? '/Applications/Helium.app/Contents/MacOS/Helium';
const NOTE = '/agent-tuning-layers';
const only = process.argv.slice(2);

const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const page = async (width, height) =>
  (await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, colorScheme: 'light' })).newPage();
const note = async (width, height) => {
  const p = await page(width, height);
  await p.goto(BASE + NOTE, { waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => {
    const el = document.querySelector('.mr-aa');
    return !!el && Object.keys(el).some((k) => k.startsWith('__reactProps$'));
  }, undefined, { timeout: 20000 });
  return p;
};
// Crop boxes in CSS px on a 1280-wide desktop or 390x844 phone viewport.
const CLIPS = {
  'reader-menu': { x: 420, y: 56, width: 800, height: 420 },
  bionic: { x: 250, y: 320, width: 640, height: 460 },
  'reader-phone': { x: 0, y: 0, width: 390, height: 520 },
  'use-with-ai-phone': { x: 0, y: 440, width: 390, height: 404 },
  'ask-drawer': { x: 416, y: 56, width: 800, height: 680 },
  'search-groups': { x: 280, y: 70, width: 720, height: 710 },
  'search-didyoumean': { x: 280, y: 70, width: 720, height: 420 },
  writers: { x: 240, y: 90, width: 800, height: 620 },
};
const snap = (p, name) => p.screenshot({ path: `${OUT}/memo-features-${name}.png`, clip: CLIPS[name] });
const openReader = async (p) => {
  await p.getByRole('button', { name: 'Reading settings' }).click();
  await p.getByRole('dialog', { name: 'Reading settings' }).waitFor();
  await p.waitForTimeout(500);
};
const search = async (p, query) => {
  const dlg = p.getByRole('dialog', { name: 'Search memo' });
  for (let i = 0; i < 10 && !(await dlg.isVisible()); i++) {
    await p.keyboard.press('Control+k');
    await p.waitForTimeout(800);
  }
  await p.getByRole('combobox').fill(query);
  await p.waitForTimeout(2500);
};

const shots = {
  async 'reader-menu'() { const p = await note(1280, 800); await openReader(p); await snap(p, 'reader-menu'); },
  async bionic() {
    const p = await note(1280, 800);
    await openReader(p);
    await p.getByRole('radio', { name: 'Read mode: Bionic' }).click();
    await p.keyboard.press('Escape');
    await p.locator('.m-prose p').nth(2).scrollIntoViewIfNeeded();
    await p.waitForTimeout(800);
    await snap(p, 'bionic');
  },
  async 'reader-phone'() { const p = await note(390, 844); await openReader(p); await snap(p, 'reader-phone'); },
  async 'use-with-ai-phone'() {
    const p = await note(390, 844);
    const menu = p.locator('.mn-ai-menu');
    await menu.scrollIntoViewIfNeeded();
    await menu.click();
    await p.locator('.mn-ai-items').waitFor();
    await p.waitForTimeout(500);
    await snap(p, 'use-with-ai-phone');
  },
  async 'ask-drawer'() {
    const p = await note(1280, 800);
    await p.waitForTimeout(4000);
    await p.locator('.mn-ai-ask').click();
    await p.locator('dialog#qa-panel').waitFor();
    await p.waitForTimeout(1500);
    await snap(p, 'ask-drawer');
  },
  async 'search-groups'() { const p = await note(1280, 800); await search(p, 'trading platform'); await snap(p, 'search-groups'); },
  async 'search-didyoumean'() { const p = await note(1280, 800); await search(p, 'kuberntes'); await snap(p, 'search-didyoumean'); },
  async writers() {
    const p = await page(1280, 900);
    await p.goto(BASE + '/writers', { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(3000);
    await snap(p, 'writers');
  },
};

const log = [];
for (const [name, fn] of Object.entries(shots)) {
  if (only.length && !only.includes(name)) continue;
  try { await fn(); log.push(`ok ${name}`); } catch (e) { log.push(`FAIL ${name}: ${String(e.message).split('\n')[0]}`); }
}
await browser.close();

// The page shows the two phone shots side by side; the singles are inputs, not assets.
const f = (n) => `${OUT}/memo-features-${n}.png`;
if (!only.length || only.some((n) => n.endsWith('-phone'))) {
  execFileSync('magick', [f('reader-phone'), '-background', 'white', '-gravity', 'east', '-splice', '40x0',
    '(', f('use-with-ai-phone'), '-gravity', 'north', '-extent', '780x1040', ')', '+append', f('phone-pair')]);
  for (const n of ['reader-phone', 'use-with-ai-phone']) execFileSync('mv', [f(n), os.tmpdir()]);
}
execFileSync('sh', ['-c', `pngquant --quality=65-85 --strip --force --ext .png "${OUT}"/memo-features-*.png || true`]);
console.log(log.join('\n'));
