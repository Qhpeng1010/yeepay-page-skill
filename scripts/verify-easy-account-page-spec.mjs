#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { assertChangeSpecPath, generatedPreviewApp, pageSpecHash, readJson, validatePageSpec } from './lib/easy-account-page-spec.mjs';

const specArg = process.argv.find((arg) => arg.endsWith('page-spec.json'));
const fast = process.argv.includes('--fast');
if (!specArg) {
  console.error('Usage: node scripts/verify-easy-account-page-spec.mjs [--fast] changes/{change-id}/page-spec.json');
  process.exit(2);
}
function hash(file) { return createHash('sha256').update(readFileSync(file)).digest('hex'); }
async function verifyList(page, changeDir) {
  await page.waitForSelector('.ea-table');
  if (await page.locator('.ea-table tbody tr').count() !== 3) throw new Error('Expected three initial account rows.');
  if (await page.locator('.ea-table .ea-status-tag').count() === 0) throw new Error('Status columns must render Ant Design Tags.');
  if (await page.locator('.ea-table .ant-badge-status').count() !== 0) throw new Error('Status columns must not render Ant Design Badges.');
  await page.screenshot({ path: resolve(changeDir, 'preview.screenshot.png'), fullPage: true });
  await page.locator('#field-accountName').fill('ERROR');
  await page.getByRole('button', { name: '查询', exact: true }).click();
  await page.getByText('查询失败').waitFor();
  await page.getByRole('button', { name: '重新查询', exact: true }).click();
  await page.getByText('账户列表').waitFor();
  await page.locator('#field-accountName').fill('NONE');
  await page.getByRole('button', { name: '查询', exact: true }).click();
  await page.getByText('暂无匹配账户').waitFor();
  await page.locator('#field-accountName').fill('');
  await page.getByRole('button', { name: '查询', exact: true }).click();
  await page.getByRole('button', { name: '列设置', exact: true }).click();
  await page.getByLabel('可用余额').uncheck();
  if (await page.getByRole('columnheader', { name: '可用余额' }).count() !== 0) throw new Error('Column settings did not hide available balance.');
  await page.getByRole('button', { name: '列设置', exact: true }).click();
  await page.getByRole('button', { name: '冻结' }).first().click();
  await page.getByRole('button', { name: '取消' }).click();
  if (await page.getByRole('dialog').count() !== 0) throw new Error('Cancel did not close confirmation.');
  await page.getByRole('button', { name: '冻结' }).first().click();
  await page.getByRole('button', { name: '确认' }).click();
  await page.getByText(/已提交冻结申请/).waitFor();
  await page.screenshot({ path: resolve(changeDir, 'preview.interaction.screenshot.png'), fullPage: true });
}

async function verifyGroupedForm(page, changeDir) {
  await page.waitForSelector('#ea-form');
  await page.getByText('账户主体信息').waitFor();
  await page.screenshot({ path: resolve(changeDir, 'preview.screenshot.png'), fullPage: true });
  await page.getByRole('button', { name: '提交开户申请', exact: true }).click();
  await page.getByText('请填写账户名称').waitFor();
  await page.locator('#form-accountName').fill('ERROR');
  await page.locator('#form-creditCode').fill('91330100MA2X123456');
  await page.locator('#form-contactPhone').fill('13800138000');
  await page.locator('#form-accountType').selectOption('basic');
  await page.locator('#form-openMode').selectOption('review');
  await page.locator('#form-dailyLimit').fill('50000');
  await page.locator('#form-purpose').fill('直营网点收款结算');
  await page.getByRole('button', { name: '提交开户申请', exact: true }).click();
  await page.getByText('账户名称已存在').waitFor();
  if (await page.locator('#form-creditCode').inputValue() !== '91330100MA2X123456') throw new Error('Server validation must preserve entered form values.');
  await page.locator('#form-accountName').fill('杭州云商结算账户');
  await page.getByRole('button', { name: '提交开户申请', exact: true }).click();
  await page.getByText('账户开立申请已提交', { exact: true }).waitFor();
  await page.screenshot({ path: resolve(changeDir, 'preview.interaction.screenshot.png'), fullPage: true });
  await page.getByRole('button', { name: '返回账户查询', exact: true }).click();
  await page.locator('#form-accountName').fill('待放弃的账户');
  await page.getByRole('button', { name: '取消', exact: true }).click();
  await page.getByText('放弃未保存修改').waitFor();
  await page.getByRole('button', { name: '继续编辑', exact: true }).click();
  if (await page.getByRole('dialog').count() !== 0) throw new Error('Continue editing must close the unsaved-change confirmation.');
}

async function browserGate(root, changeDir, spec) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
    await page.goto(`file://${resolve(changeDir, 'preview.html')}`);
    if (spec.metadata.family === 'list') await verifyList(page, changeDir);
    if (spec.metadata.family === 'form') await verifyGroupedForm(page, changeDir);
  } finally {
    await browser.close();
  }
}
try {
  const root = process.cwd();
  const specPath = assertChangeSpecPath(root, specArg);
  const changeDir = dirname(specPath);
  const spec = readJson(specPath);
  const errors = validatePageSpec(spec, { root });
  if (errors.length) throw new Error(errors.join('\n'));
  const appPath = resolve(changeDir, 'preview-app.js');
  if (!existsSync(appPath) || readFileSync(appPath, 'utf8') !== generatedPreviewApp(spec)) throw new Error('preview-app.js is stale or edited.');
  const record = readJson(resolve(changeDir, 'page-spec-build.json'));
  if (record.pageSpecHash !== pageSpecHash(spec)) throw new Error('page-spec-build.json does not match page-spec.json.');
  for (const [file, expected] of Object.entries(record.generated || {})) {
    const absolute = resolve(changeDir, file);
    if (!existsSync(absolute) || hash(absolute) !== expected) throw new Error(`Derived artifact drift detected: ${file}.`);
  }
  if (!fast) await browserGate(root, changeDir, spec);
  console.log(`easy-account-page-spec-delivery: pass (${relative(root, specPath)}${fast ? ', fast' : ', browser'})`);
} catch (error) {
  console.error(`easy-account-page-spec-delivery: failed\n- ${error.message}`);
  process.exit(1);
}
