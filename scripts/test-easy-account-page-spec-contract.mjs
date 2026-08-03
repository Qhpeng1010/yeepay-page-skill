#!/usr/bin/env node
import { readJson, validatePageSpec } from './lib/easy-account-page-spec.mjs';

const root = process.cwd();
const pilot = readJson('changes/20260803-store-management-query/page-spec.json');
const groupedForm = readJson('changes/20260803-easy-account-grouped-form/page-spec.json');
const accountDetail = readJson('changes/20260803-easy-account-account-detail/page-spec.json');
const settlementChange = readJson('changes/20260803-easy-account-settlement-change/page-spec.json');
const settlementImport = readJson('changes/20260803-easy-account-settlement-import/page-spec.json');
const accountWorkbench = readJson('changes/20260803-easy-account-account-workbench/page-spec.json');
const settlementBatch = readJson('changes/20260803-easy-account-settlement-batch/page-spec.json');
const basicPilot = {
  ...pilot,
  content: { ...pilot.content, capabilities: pilot.content.capabilities.filter((capability) => capability !== 'query.advanced').concat('query.basic') },
  list: { ...pilot.list, query: { ...pilot.list.query, fields: pilot.list.query.fields.slice(0, 3) } }
};
const cases = [
  ['pilot', pilot, false],
  ['grouped-form', groupedForm, false],
  ['account-detail', accountDetail, false],
  ['settlement-change', settlementChange, false],
  ['settlement-import', settlementImport, false],
  ['account-workbench', accountWorkbench, false],
  ['settlement-batch', settlementBatch, false],
  ['wrong-system', { ...pilot, ui: { ...pilot.ui, system: 'boss-ledger' } }, true],
  ['unknown-capability', { ...pilot, content: { capabilities: [...pilot.content.capabilities, 'table.tree'] } }, true],
  ['too-many-basic-fields', { ...basicPilot, list: { ...basicPilot.list, query: { fields: [...basicPilot.list.query.fields, ...basicPilot.list.query.fields, { key: 'extra', label: '额外字段', control: 'input' }] } } }, true],
  ['unknown-rule', { ...pilot, metadata: { ...pilot.metadata, ruleRefs: [...pilot.metadata.ruleRefs, 'EA-VIS-999'] } }, true],
  ['grouped-form-without-submit', { ...groupedForm, form: { ...groupedForm.form, submit: {} } }, true],
  ['workbench-without-delete-capability', { ...accountWorkbench, content: { ...accountWorkbench.content, capabilities: accountWorkbench.content.capabilities.filter((capability) => capability !== 'table.deleteAction') } }, true],
  ['detail-without-metrics-capability', { ...accountDetail, content: { ...accountDetail.content, capabilities: accountDetail.content.capabilities.filter((capability) => capability !== 'detail.metrics') } }, true],
  ['import-without-upload-capability', { ...settlementImport, content: { ...settlementImport.content, capabilities: settlementImport.content.capabilities.filter((capability) => capability !== 'form.upload') } }, true]
];
const failures = [];
for (const [name, spec, shouldFail] of cases) {
  const errors = validatePageSpec(spec, { root });
  if ((errors.length > 0) !== shouldFail) failures.push(`${name}: expected ${shouldFail ? 'rejection' : 'acceptance'}, got ${errors.length ? errors.join('; ') : 'acceptance'}`);
}
if (failures.length) {
  console.error('easy-account-page-spec-contract-regression: failed');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`easy-account-page-spec-contract-regression: pass (${cases.length} cases)`);
