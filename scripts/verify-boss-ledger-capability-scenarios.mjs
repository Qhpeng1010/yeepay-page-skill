#!/usr/bin/env node
// rule-assertion: behavior.capability-scenarios
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { scenarios } from '../modules/boss-ledger/execution/scenarios/capability-scenarios.mjs';
import { generatedPreviewApp, pageSpecHash, readJson, validatePageSpec } from './lib/boss-ledger-page-spec.mjs';

const root = process.cwd();
const fastMode = process.argv.includes('--fast');
const requested = process.argv.find((arg) => arg.startsWith('--scenario='))?.split('=')[1];
const requestedIds = process.argv.find((arg) => arg.startsWith('--scenarios='))?.split('=')[1]?.split(',').filter(Boolean);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function fileHash(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function changeDir(scenario) {
  return resolve(root, 'changes', scenario.spec.metadata.changeId);
}

async function selectOption(page, key, label) {
  const control = page.locator(`#${key}`);
  await control.click({ force: true });
  await control.press('ArrowDown');
  await control.press('Enter');
}

async function clickButton(page, pattern) {
  await page.getByRole('button', { name: pattern }).first().click();
}

async function verifyContactModal(page) {
  await page.locator('.ant-modal').waitFor();
  await clickButton(page, /保\s*存/);
  await page.getByText('请填写联系人姓名', { exact: true }).waitFor();
  await page.locator('#contactName').fill('张敏');
  await page.locator('#mobile').fill('13800138000');
  await selectOption(page, 'channel', '线上收单');
  await clickButton(page, /保\s*存/);
  await page.getByText('保存成功', { exact: true }).waitFor();
}

async function verifySimplePageForm(page) {
  await page.getByText('登记渠道联系人', { exact: true }).first().waitFor();
  assert(await page.locator('.ant-modal').count() === 0, 'Independent simple form must not open in a Modal.');
  assert(await page.locator('.boss-full-page-action-bar').count() === 1, 'Independent simple form requires the workspace fixed action bar.');
  await clickButton(page, /保\s*存/);
  await page.getByText('请填写联系人姓名', { exact: true }).waitFor();
  await page.locator('#contactName').fill('张敏');
  await page.locator('#mobile').fill('13800138000');
  await selectOption(page, 'channel', '线上收单');
  await clickButton(page, /保\s*存/);
  await page.getByText('保存成功', { exact: true }).waitFor();
}

async function verifyGuidedForm(page) {
  await page.getByText('结算账户变更', { exact: true }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(100);
  assert(!(await page.locator('.boss-form-side-guide').isVisible()), 'The guided form side explanation must be hidden on narrow screens.');
}

async function verifyGroupedForm(page) {
  await page.getByText('商户基本信息', { exact: true }).waitFor();
  await page.getByText('收款账户', { exact: true }).waitFor();
  await page.locator('.boss-section-title', { hasText: '结算周期' }).waitFor();
  assert(await page.locator('.boss-full-page-action-bar').count() === 1, 'Grouped form requires the workspace fixed action bar.');
}

async function verifyAccountWizard(page) {
  await clickButton(page, /^下一步$/);
  await selectOption(page, 'accountType', '对公账户');
  await page.locator('#legalCard').fill('6222021234567890123');
  await page.locator('#accountName').fill('杭州星云商贸有限公司');
  await page.locator('#bankName').fill('招商银行杭州分行');
  await page.locator('#bankAccount').fill('6222021234567890123');
  await clickButton(page, /^下一步$/);
  await page.getByText('确认提交', { exact: true }).last().waitFor();
  await clickButton(page, /提\s*交/);
  await page.locator('.ant-modal-confirm').getByText('确认提交', { exact: true }).waitFor();
  await page.locator('.ant-modal-confirm').getByRole('button', { name: /提\s*交/ }).click();
  await page.getByText('账户变更完成', { exact: true }).waitFor();
  await page.locator('.ant-modal-confirm').waitFor({ state: 'hidden' });
  await clickButton(page, '返回列表');
  await page.getByText('已返回来源列表', { exact: true }).waitFor();
}

async function verifyUploadWizard(page) {
  await clickButton(page, /^下一步$/);
  await page.getByText('请上传 xlsx 文件', { exact: true }).waitFor();
  await page.locator('.ant-upload input[type="file"]').setInputFiles({ name: 'merchant-settlement.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from('demo') });
  await clickButton(page, /^下一步$/);
  await page.getByText('10001', { exact: true }).waitFor();
  await page.getByText('待生效', { exact: true }).first().waitFor();
  await clickButton(page, /^下一步$/);
  await clickButton(page, '确认导入');
  await page.locator('.ant-modal-confirm').getByText('确认导入', { exact: true }).waitFor();
  await page.locator('.ant-modal-confirm').getByRole('button', { name: /提\s*交/ }).click();
  await page.getByText('导入完成', { exact: true }).waitFor();
  await page.getByText('成功导入 2 条记录。', { exact: true }).first().waitFor();
  await page.locator('.ant-modal-confirm').waitFor({ state: 'hidden' });
}

async function verifySimpleList(page) {
  await page.getByText('R001', { exact: true }).waitFor();
  await clickButton(page, '修改');
  await page.locator('.ant-drawer').getByText('修改分账规则', { exact: true }).waitFor();
  await page.getByRole('button', { name: '关闭表单', exact: true }).click();
  await clickButton(page, '失效');
  await page.locator('.ant-modal-confirm').getByText('失效后该规则不再参与后续分账。', { exact: true }).waitFor();
  await page.locator('.ant-modal-confirm').getByRole('button', { name: /确\s*定/ }).click();
  await page.getByText('分账规则已失效。', { exact: true }).waitFor();
}

async function verifyAdvancedList(page) {
  await clickButton(page, /展\s*开/);
  await page.locator('#ruleNo').waitFor();
  await clickButton(page, '新增规则');
  await page.locator('.ant-drawer').getByText('新增结算规则', { exact: true }).waitFor();
  await page.getByRole('button', { name: '关闭表单', exact: true }).click();
  await page.getByRole('button', { name: '列设置', exact: true }).click();
  await page.locator('.boss-column-settings').getByText('列设置', { exact: true }).waitFor();
  assert(await page.locator('[aria-label="拖拽排序"]').count() > 0, 'Column settings must expose draggable ordering controls.');
  await page.getByRole('button', { name: '列设置', exact: true }).click();
}

async function verifyStatistics(page) {
  for (const label of ['本期结算笔数', '应付总金额', '实打款总金额', '打款失败']) await page.getByText(label, { exact: true }).first().waitFor();
  assert(await page.locator('.boss-statistic-card').count() === 4, 'Statistics scenario must render four cards.');
}

async function verifyBatch(page) {
  await page.locator('.ant-table-tbody input[type="checkbox"]').first().check();
  await page.getByText('已选择 1 项', { exact: true }).waitFor();
  await clickButton(page, '批量驳回');
  await page.locator('.ant-modal-confirm').getByText('所选规则需重新修改后再提交审核。', { exact: true }).waitFor();
  await page.locator('.ant-modal-confirm').getByRole('button', { name: /确\s*定/ }).click();
  await page.getByText('所选结算规则已驳回。', { exact: true }).waitFor();
}

async function verifyExpand(page) {
  await page.locator('.ant-table-row-expand-icon').click();
  await page.getByText('杭州星云商贸有限公司', { exact: true }).waitFor();
  await page.getByText('上海锦程科技有限公司', { exact: true }).waitFor();
}

async function verifyCreateAndDrawerDetail(page) {
  await clickButton(page, '新增规则');
  const createDrawer = page.locator('.ant-drawer').filter({ hasText: '新增结算规则' });
  await createDrawer.getByText('新增结算规则', { exact: true }).waitFor();
  await createDrawer.locator('#ruleName').fill('新增结算规则');
  await createDrawer.locator('#merchantName').fill('北京新锐商贸有限公司');
  const status = createDrawer.locator('#status');
  await status.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await clickButton(page, /保\s*存/);
  await page.getByText('结算规则已新增。', { exact: true }).waitFor();
  await page.getByText('R003', { exact: true }).waitFor();
  await page.locator('.ant-table-tbody > tr').filter({ hasText: 'R001' }).getByRole('button', { name: '详情', exact: true }).click();
  await page.locator('.ant-drawer').getByText('结算规则详情', { exact: true }).waitFor();
  await clickButton(page, /关\s*闭/);
  await page.getByText('新增结算规则', { exact: true }).waitFor();
}

async function verifyQuickModal(page) {
  const modal = page.locator('.ant-modal').filter({ hasText: 'JS20260716001' });
  await modal.getByText('JS20260716001', { exact: true }).waitFor();
  await modal.getByRole('button', { name: /关\s*闭/ }).click();
  await modal.waitFor({ state: 'hidden' });
}

async function verifyDrawerTable(page) {
  await clickButton(page, '详情');
  const drawer = page.locator('.ant-drawer');
  await drawer.getByText('分账记录详情', { exact: true }).waitFor();
  await drawer.getByText('10082983398', { exact: true }).waitFor();
  await drawer.getByText('余额不足', { exact: true }).first().waitFor();
  await drawer.getByRole('button', { name: '我知道了', exact: true }).click();
  await page.getByText('分账记录列表', { exact: true }).waitFor();
}

async function verifyAnchors(page) {
  assert(await page.locator('.boss-detail-anchors a').count() === 7, 'Long detail must expose seven anchor entries.');
  await page.locator('.boss-detail-anchors a').filter({ hasText: '费率配置' }).click();
  await page.getByText('服务费率', { exact: true }).waitFor();
  assert(await page.locator('#detail-rate').count() === 1, 'Anchor target must be rendered.');
}

async function verifyTabs(page) {
  await page.getByRole('tab', { name: '资金流水', exact: true }).click();
  await page.getByText('LS001', { exact: true }).waitFor();
  await page.getByText('冻结中', { exact: true }).waitFor();
}

const scenarioChecks = {
  '01-contact-create': verifyContactModal,
  '16-contact-create-page': verifySimplePageForm,
  '02-settlement-account-change': verifyGuidedForm,
  '03-merchant-settlement-config': verifyGroupedForm,
  '04-settlement-account-wizard': verifyAccountWizard,
  '05-settlement-import': verifyUploadWizard,
  '06-split-rule-query': verifySimpleList,
  '07-settlement-rule-advanced': verifyAdvancedList,
  '08-settlement-bill-statistics': verifyStatistics,
  '09-settlement-rule-batch-review': verifyBatch,
  '10-settlement-batch-expand': verifyExpand,
  '11-settlement-rule-management': verifyCreateAndDrawerDetail,
  '12-settlement-quick-detail': verifyQuickModal,
  '13-split-record-drawer': verifyDrawerTable,
  '14-merchant-settlement-long-detail': verifyAnchors,
  '15-settlement-account-tabs': verifyTabs
};
const selectedScenarios = requestedIds?.length
  ? scenarios.filter((scenario) => requestedIds.includes(scenario.id))
  : requested ? scenarios.filter((scenario) => scenario.id === requested) : scenarios;
if (!selectedScenarios.length) {
  console.error(`Unknown capability scenario: ${requested || requestedIds?.join(',')}`);
  process.exit(2);
}

function verifyScenarioArtifacts(scenario) {
  const dir = changeDir(scenario);
  const specPath = resolve(dir, 'page-spec.json');
  const previewApp = resolve(dir, 'preview-app.js');
  const buildPath = resolve(dir, 'page-spec-build.json');
  const errors = validatePageSpec(scenario.spec, { root });
  assert(errors.length === 0, `${scenario.id}: source contract failed: ${errors.join(' | ')}`);
  assert(existsSync(specPath) && existsSync(previewApp) && existsSync(buildPath), `${scenario.id}: delivery artifacts are missing.`);
  const builtSpec = readJson(specPath);
  assert(pageSpecHash(builtSpec) === pageSpecHash(scenario.spec), `${scenario.id}: materialized page spec is stale.`);
  assert(readFileSync(previewApp, 'utf8') === generatedPreviewApp(builtSpec), `${scenario.id}: preview application is stale.`);
  const record = readJson(buildPath);
  assert(record.pageSpecHash === pageSpecHash(builtSpec), `${scenario.id}: build record does not match the Page Spec.`);
  for (const [file, expected] of Object.entries(record.generated || {})) {
    const target = resolve(dir, file);
    assert(existsSync(target) && fileHash(target) === expected, `${scenario.id}: generated artifact drift in ${file}.`);
  }
}

async function verifyScenario(browser, scenario) {
  const dir = changeDir(scenario);
  verifyScenarioArtifacts(scenario);
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.stack || error.message || JSON.stringify(error)));
  try {
    await page.goto(`file://${resolve(dir, 'preview.html')}`);
    await page.locator('#root .boss-shell').waitFor();
    await scenarioChecks[scenario.id](page);
    const meaningfulErrors = browserErrors.filter((error) => !String(error).trim().startsWith('Object'));
    assert(meaningfulErrors.length === 0, `${scenario.id}: browser error: ${meaningfulErrors.join(' | ')}`);
    const screenshot = resolve(dir, 'preview.capability.screenshot.png');
    await page.screenshot({ path: screenshot, fullPage: true });
    assert(statSync(screenshot).size > 5000, `${scenario.id}: screenshot is unexpectedly small.`);
  } finally {
    await page.close();
  }
}

if (fastMode) {
  try {
    for (const scenario of selectedScenarios) {
      verifyScenarioArtifacts(scenario);
      console.log(`capability-scenario: pass (${scenario.id}, static)`);
    }
    console.log(`boss-ledger-capability-scenarios: pass (${selectedScenarios.length} scenarios, static)`);
  } catch (error) {
    console.error(`boss-ledger-capability-scenarios: failed\n- ${error.message}`);
    process.exitCode = 1;
  }
} else {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const scenario of selectedScenarios) {
      await verifyScenario(browser, scenario);
      console.log(`capability-scenario: pass (${scenario.id})`);
    }
    console.log(`boss-ledger-capability-scenarios: pass (${selectedScenarios.length} scenarios)`);
  } catch (error) {
    console.error(`boss-ledger-capability-scenarios: failed\n- ${error.message}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}
