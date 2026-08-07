#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { chromium } from 'playwright';
import { assertChangeSpecPath, generatedPreviewApp, pageSpecHash, readJson, validatePageSpec } from './lib/open-platform-page-spec.mjs';

const specArg = process.argv.find((arg) => arg.endsWith('page-spec.json'));
const fast = process.argv.includes('--fast');
const flexible = process.argv.includes('--flexible');
if (!specArg) {
  console.error('Usage: node scripts/verify-open-platform-page-spec.mjs [--fast] [--flexible] changes/{change-id}/page-spec.json');
  process.exit(2);
}

const hash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

async function browserGate(changeDir, spec) {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
    await page.goto(`file://${resolve(changeDir, 'preview.html')}`);
    await page.waitForSelector('.op-doc-layout');
    if (await page.locator('.op-toc a').count() < 3) throw new Error('Expected document table of contents.');
    await page.screenshot({ path: resolve(changeDir, 'preview.screenshot.png'), fullPage: true });
    if (spec.metadata.family === 'integration-guide') {
      await page.locator('.op-guide-step').first().waitFor();
      await page.getByRole('link', { name: '配置商户密钥', exact: true }).click();
    } else {
      await page.getByRole('link', { name: '请求示例', exact: true }).click();
    }
    await page.waitForFunction(() => window.scrollY > 0);
    await page.locator('#op-catalog-search').fill('NONE');
    await page.getByText('暂无匹配目录').waitFor();
    await page.locator('#op-catalog-search').fill('ERROR');
    await page.getByText('目录加载失败').waitFor();
    await page.locator('#op-catalog-search').fill('');
    await page.getByRole('button', { name: '复制', exact: true }).first().click();
    await page.getByText(spec.metadata.family === 'integration-guide' ? '示例已复制' : '请求示例已复制').waitFor();
    await page.screenshot({ path: resolve(changeDir, 'preview.interaction.screenshot.png'), fullPage: true });
    const compact = await browser.newPage({ viewport: { width: 1024, height: 900 }, deviceScaleFactor: 1 });
    await compact.goto(`file://${resolve(changeDir, 'preview.html')}`);
    await compact.waitForSelector('.op-doc-layout');
    if (await compact.locator('.op-toc').isVisible()) throw new Error('Table of contents must hide at 1024px.');
  } finally {
    await browser.close();
  }
}

try {
  const root = process.cwd();
  const specPath = assertChangeSpecPath(root, specArg);
  const changeDir = dirname(specPath);
  const spec = readJson(specPath);
  const errors = validatePageSpec(spec, { root, strictGovernance: !flexible });
  if (errors.length) throw new Error(errors.join('\n'));
  const app = resolve(changeDir, 'preview-app.js');
  if (!existsSync(app) || readFileSync(app, 'utf8') !== generatedPreviewApp(spec)) throw new Error('preview-app.js is stale or edited.');
  const record = readJson(resolve(changeDir, 'page-spec-build.json'));
  if (record.pageSpecHash !== pageSpecHash(spec)) throw new Error('page-spec-build.json does not match page-spec.json.');
  for (const [file, expected] of Object.entries(record.generated || {})) {
    const target = resolve(changeDir, file);
    if (!existsSync(target) || hash(target) !== expected) throw new Error(`Derived artifact drift detected: ${file}.`);
  }
  if (!fast) await browserGate(changeDir, spec);
  console.log(`open-platform-page-spec-delivery: pass (${relative(root, specPath)}${fast ? ', fast' : ', browser'})`);
} catch (error) {
  console.error(`open-platform-page-spec-delivery: failed\n- ${error.message}`);
  process.exit(1);
}
