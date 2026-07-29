#!/usr/bin/env node
// rule-assertion: delivery.derived-artifacts
// rule-assertion: behavior.list-workflow
// rule-assertion: behavior.form-workflow
// rule-assertion: behavior.wizard-workflow
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright';
import {
  assertChangeSpecPath,
  generatedPreviewApp,
  pageSpecHash,
  readJson,
  validatePageSpec
} from './lib/boss-ledger-page-spec.mjs';

const specArg = process.argv.find((arg) => arg.endsWith('page-spec.json'));
const fast = process.argv.includes('--fast');
if (!specArg) {
  console.error('Usage: node scripts/verify-boss-ledger-page-spec.mjs [--fast] changes/{change-id}/page-spec.json');
  process.exit(2);
}

function run(root, label, args) {
  const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`${label} failed.`);
}

function hash(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function statusLabel(table, value) {
  const column = (table.columns || []).find((item) => item.format === 'status');
  return column?.statusMap?.[value]?.label || String(value);
}

function queryTextbox(page, label) {
  return page.getByRole('textbox', { name: new RegExp(`^${label}`) });
}

async function verifyListWorkflow(page, changeDir, spec) {
  const table = spec.list?.table;
  const detailAction = (table?.rowActions || []).find((action) => action.type === 'detail');
  const stateAction = (table?.rowActions || []).find((action) => action.type === 'confirm-state-change');
  if (!table || (!detailAction && !stateAction)) return;

  await page.waitForSelector('.boss-result-module');
  const runQuery = async () => {
    await page.getByRole('button', { name: /查\s*询/ }).click();
    await page.waitForTimeout((spec.states?.loading?.delayMs || 220) + 80);
  };
  const firstRow = table.rows[0];
  const nameField = (spec.list.query.fields || []).find((field) => field.key === 'merchantName');
  if (nameField && firstRow[nameField.key]) {
    await queryTextbox(page, nameField.label).fill(firstRow[nameField.key]);
    await runQuery();
    await page.getByText(String(firstRow[table.rowKey]), { exact: true }).waitFor();
    const nonMatching = table.rows.find((row) => row[table.rowKey] !== firstRow[table.rowKey]);
    if (nonMatching && await page.locator('.ant-table-tbody > tr').filter({ hasText: String(nonMatching[table.rowKey]) }).count() !== 0) {
      throw new Error('Query did not remove non-matching records.');
    }
  }

  if ((table.tools || []).includes('settings')) {
    const settings = page.getByRole('button', { name: '列设置', exact: true });
    await settings.click();
    const hideable = table.columns.find((column) => column.hideable !== false && column.key !== 'actions');
    if (hideable) {
      await page.getByRole('checkbox', { name: hideable.label, exact: true }).uncheck();
      if (await page.getByRole('columnheader', { name: hideable.label, exact: true }).count() !== 0) throw new Error('Column settings did not hide the selected column.');
    }
    await settings.click();
  }

  const row = page.locator('.ant-table-tbody > tr').filter({ hasText: String(firstRow[table.rowKey]) });
  if (detailAction && table.drawerDetail) {
    await row.getByRole('button', { name: detailAction.label, exact: true }).click();
    const drawer = page.locator('.ant-drawer').filter({ hasText: table.drawerDetail.title });
    await drawer.getByText(table.drawerDetail.title, { exact: true }).waitFor();
    await drawer.getByText(String(firstRow[table.rowKey]), { exact: true }).waitFor();
    await drawer.getByRole('button', { name: table.drawerDetail.closeLabel, exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('.ant-drawer.ant-drawer-open'));
    if (nameField && await queryTextbox(page, nameField.label).inputValue() !== firstRow[nameField.key]) {
      throw new Error('Closing the detail Drawer reset the source query context.');
    }
  }

  if (stateAction && (!stateAction.visibleWhen || firstRow[stateAction.visibleWhen.field] === stateAction.visibleWhen.equals)) {
    await row.getByRole('button', { name: stateAction.label, exact: true }).click();
    const modal = page.locator('.ant-modal-confirm');
    await modal.getByText(stateAction.confirm.description, { exact: true }).waitFor();
    await modal.getByText(stateAction.confirm.impact, { exact: true }).waitFor();
    if (stateAction.confirm.reversible === false) await modal.getByText('此操作不可撤销', { exact: true }).waitFor();
    await modal.getByRole('button', { name: /确\s*定/ }).click();
    await page.getByText(stateAction.confirm.successMessage, { exact: true }).waitFor();
    await row.getByText(statusLabel(table, stateAction.effect.value), { exact: true }).waitFor();
    if (await row.getByRole('button', { name: stateAction.label, exact: true }).count() !== 0) throw new Error('State-changing action remained available after its resulting status was applied.');
  }

  const error = spec.states?.error;
  if (error?.trigger) {
    const errorField = (spec.list.query.fields || []).find((field) => field.key === error.trigger.field);
    if (errorField) {
      await queryTextbox(page, errorField.label).fill(error.trigger.value);
      await runQuery();
      await page.getByText(error.title, { exact: true }).waitFor();
      await queryTextbox(page, errorField.label).fill('');
      await runQuery();
      await page.getByText(String(firstRow[table.rowKey]), { exact: true }).waitFor();
    }
  }

  await page.getByRole('button', { name: /重\s*置/ }).click();
  if (nameField && await queryTextbox(page, nameField.label).inputValue() !== '') throw new Error('Reset did not clear the query condition.');
  await page.screenshot({ path: resolve(changeDir, 'preview.interaction.screenshot.png'), fullPage: true });
}

async function fillFormVerificationValues(page, fields, values) {
  for (const field of fields) {
    if (!Object.hasOwn(values, field.key)) continue;
    const value = values[field.key];
    if (field.control === 'radio') {
      const option = field.options.find((item) => item.value === value);
      if (!option) throw new Error(`Verification value for ${field.key} does not match a radio option.`);
      await page.getByRole('radio', { name: option.label, exact: true }).check();
    } else if (field.control === 'select') {
      const option = field.options.find((item) => item.value === value);
      if (!option) throw new Error(`Verification value for ${field.key} does not match a select option.`);
      await page.getByRole('combobox', { name: new RegExp(`^${field.label}`) }).click();
      await page.getByRole('option', { name: option.label, exact: true }).click();
    } else if (field.control === 'number') {
      await page.locator(`#${field.key}`).fill(String(value));
    } else {
      await page.locator(`#${field.key}`).fill(String(value));
    }
  }
}

async function verifyFormWorkflow(page, changeDir, spec) {
  const form = spec.form;
  const failure = form?.submit?.failure;
  if (!form || !failure) return;
  const fields = form.fields || form.groups?.flatMap((group) => group.fields || []) || [];
  const requiredField = fields.find((field) => field.required);
  await page.waitForSelector('.boss-form-module');
  await page.getByRole('button', { name: form.submit.primaryLabel, exact: true }).click();
  if (requiredField) await page.getByText(requiredField.requiredMessage || `请填写${requiredField.label}`, { exact: true }).waitFor();

  const failingValues = { ...form.verification.validValues, [failure.trigger.field]: failure.trigger.value };
  await fillFormVerificationValues(page, fields, failingValues);
  await page.getByRole('button', { name: form.submit.primaryLabel, exact: true }).click();
  await page.getByText(failure.message, { exact: true }).waitFor();
  await page.getByText(failure.recovery, { exact: true }).waitFor();
  const failedField = fields.find((field) => field.key === failure.trigger.field);
  if (failedField?.control === 'input' && await page.locator(`#${failedField.key}`).inputValue() !== String(failure.trigger.value)) {
    throw new Error('Submission failure did not preserve the entered field value.');
  }

  await fillFormVerificationValues(page, fields, form.verification.validValues);
  await page.getByRole('button', { name: form.submit.primaryLabel, exact: true }).click();
  await page.getByText(form.submit.success.title || '提交成功', { exact: true }).waitFor();
  await page.screenshot({ path: resolve(changeDir, 'preview.interaction.screenshot.png'), fullPage: true });
}

async function verifyWizardWorkflow(page, changeDir, spec) {
  const form = spec.form;
  if (!form?.steps) return;
  const fields = form.steps.flatMap((step) => step.fields || []);
  const firstStep = form.steps[0];
  const secondStep = form.steps[1];
  const requiredField = firstStep.fields.find((field) => field.required);
  await page.waitForSelector('.boss-wizard-page');
  await page.getByRole('button', { name: '下一步', exact: true }).click();
  if (requiredField) await page.getByText(requiredField.requiredMessage || `请填写${requiredField.label}`, { exact: true }).waitFor();

  await fillFormVerificationValues(page, firstStep.fields, form.verification.validValues);
  await page.getByRole('button', { name: '下一步', exact: true }).click();
  await page.locator(`#${secondStep.fields[0].key}`).waitFor();
  await page.getByRole('button', { name: '上一步', exact: true }).click();
  if (await page.locator(`#${firstStep.fields[0].key}`).inputValue() !== String(form.verification.validValues[firstStep.fields[0].key])) {
    throw new Error('Returning to a previous step did not preserve valid input.');
  }
  await page.getByRole('button', { name: '下一步', exact: true }).click();
  await fillFormVerificationValues(page, secondStep.fields, form.verification.validValues);
  await page.getByRole('button', { name: '下一步', exact: true }).click();
  await page.locator('.boss-wizard-page .ant-descriptions').waitFor();
  await page.getByText(String(form.verification.validValues[firstStep.fields[0].key]), { exact: true }).waitFor();
  await page.getByRole('button', { name: '提 交', exact: true }).click();
  const modal = page.locator('.ant-modal-confirm');
  await modal.getByText('提交确认', { exact: true }).waitFor();
  await modal.getByRole('button', { name: '提 交', exact: true }).click();
  await page.getByText(form.submit.success.title || '提交成功', { exact: true }).waitFor();
  await page.screenshot({ path: resolve(changeDir, 'preview.interaction.screenshot.png'), fullPage: true });
}

async function browserGate(changeDir, spec) {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
    await page.goto(`file://${resolve(changeDir, 'preview.html')}`);
    if (spec.metadata.family === 'list') await verifyListWorkflow(page, changeDir, spec);
    if (spec.metadata.family === 'form') await verifyFormWorkflow(page, changeDir, spec);
    if (spec.metadata.family === 'form') await verifyWizardWorkflow(page, changeDir, spec);
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
  run(root, 'release-manifest', [resolve(root, 'scripts/verify-boss-ledger-release-manifest.mjs')]);

  const appPath = resolve(changeDir, 'preview-app.js');
  if (!existsSync(appPath) || readFileSync(appPath, 'utf8') !== generatedPreviewApp(spec)) {
    throw new Error('preview-app.js is stale or was edited; rebuild from page-spec.json.');
  }
  const recordPath = resolve(changeDir, 'page-spec-build.json');
  if (!existsSync(recordPath)) throw new Error('page-spec-build.json is missing; rebuild the Page Spec.');
  const record = readJson(recordPath);
  if (record.pageSpecHash !== pageSpecHash(spec)) throw new Error('page-spec-build.json does not match page-spec.json.');
  for (const [file, expected] of Object.entries(record.generated || {})) {
    const absolute = resolve(changeDir, file);
    if (!existsSync(absolute) || hash(absolute) !== expected) throw new Error(`Derived artifact drift detected: ${file}.`);
  }

  run(root, 'canonical-and-browser', [
    resolve(root, 'scripts/verify-boss-ledger-change.mjs'),
    ...(fast ? ['--fast'] : []),
    resolve(changeDir, 'preview.html')
  ]);
  if (!fast) await browserGate(changeDir, spec);
  console.log(`page-spec-delivery: pass (${relative(root, specPath)})`);
} catch (error) {
  console.error(`page-spec-delivery: failed\n- ${error.message}`);
  process.exit(1);
}
