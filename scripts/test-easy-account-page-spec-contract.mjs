#!/usr/bin/env node
import { readJson, validatePageSpec } from './lib/easy-account-page-spec.mjs';

const root = process.cwd();
const pilot = readJson('changes/20260729-page-spec-easy-account-query/page-spec.json');
const groupedForm = readJson('changes/20260729-page-spec-easy-account-onboarding/page-spec.json');
const cases = [
  ['pilot', pilot, false],
  ['grouped-form', groupedForm, false],
  ['wrong-system', { ...pilot, ui: { ...pilot.ui, system: 'boss-ledger' } }, true],
  ['unknown-capability', { ...pilot, content: { capabilities: [...pilot.content.capabilities, 'table.tree'] } }, true],
  ['too-many-basic-fields', { ...pilot, list: { ...pilot.list, query: { fields: [...pilot.list.query.fields, ...pilot.list.query.fields, { key: 'extra', label: '额外字段', control: 'input' }] } } }, true],
  ['unknown-rule', { ...pilot, metadata: { ...pilot.metadata, ruleRefs: [...pilot.metadata.ruleRefs, 'EA-VIS-999'] } }, true],
  ['grouped-form-without-submit', { ...groupedForm, form: { ...groupedForm.form, submit: {} } }, true]
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
