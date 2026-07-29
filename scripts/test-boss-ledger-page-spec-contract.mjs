#!/usr/bin/env node
// rule-assertion: contract.regression
import { readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { readJson, validatePageSpec } from './lib/boss-ledger-page-spec.mjs';

const root = process.cwd();
const fixtureRoot = resolve(root, 'modules/boss-ledger/execution/fixtures');
const failures = [];
let passed = 0;

for (const name of readdirSync(resolve(fixtureRoot, 'valid')).filter((file) => file.endsWith('.json'))) {
  const errors = validatePageSpec(readJson(resolve(fixtureRoot, 'valid', name)), { root });
  if (errors.length) failures.push(`${name}: expected valid, received ${errors.join(' | ')}`);
  else passed += 1;
}

for (const name of readdirSync(resolve(fixtureRoot, 'invalid')).filter((file) => file.endsWith('.json'))) {
  const testCase = readJson(resolve(fixtureRoot, 'invalid', name));
  const errors = validatePageSpec(testCase.spec, { root });
  if (!errors.includes(testCase.expectedError)) failures.push(`${basename(name)}: expected error '${testCase.expectedError}', received ${errors.join(' | ')}`);
  else passed += 1;
}

const merchantPilot = readJson(resolve(root, 'changes/20260728-page-spec-merchant-query/page-spec.json'));
const settlementForm = readJson(resolve(root, 'changes/20260729-page-spec-merchant-settlement-config/page-spec.json'));
const splitRuleWizard = readJson(resolve(root, 'changes/20260729-page-spec-split-rule-create/page-spec.json'));
const directCases = [
  [
    'missing-assumptions',
    { ...merchantPilot, metadata: { ...merchantPilot.metadata, assumptions: [] } },
    'metadata.assumptions must be a non-empty string array.'
  ],
  [
    'hideable-operation-column',
    { ...merchantPilot, list: { ...merchantPilot.list, table: { ...merchantPilot.list.table, columns: merchantPilot.list.table.columns.map((column) => column.key === 'actions' ? { ...column, hideable: true } : column) } } },
    'Operation columns must declare hideable=false.'
  ],
  [
    'drawer-detail-without-capability',
    { ...merchantPilot, content: { ...merchantPilot.content, capabilities: merchantPilot.content.capabilities.filter((capability) => capability !== 'detail.drawer') } },
    'Detail row actions require detail.drawer.'
  ],
  [
    'state-change-without-impact',
    { ...merchantPilot, list: { ...merchantPilot.list, table: { ...merchantPilot.list.table, rowActions: merchantPilot.list.table.rowActions.map((action) => action.key === 'disable' ? { ...action, confirm: { ...action.confirm, impact: '' } } : action) } } },
    'list.table.rowActions[1].confirm.impact is required.'
  ],
  [
    'form-failure-without-recovery-verification',
    { ...settlementForm, form: { ...settlementForm.form, verification: undefined } },
    'form.submit.failure requires form.verification.validValues for recovery regression.'
  ],
  [
    'mode-override',
    { ...merchantPilot, metadata: { ...merchantPilot.metadata, executionMode: 'shadow', validatedCombinations: ['form.grouped'] } },
    'metadata.executionMode must equal policy mode page-spec-default for template-03-query-list-regular.'
  ],
  [
    'shadow-without-validated-combination',
    { ...splitRuleWizard, metadata: { ...splitRuleWizard.metadata, validatedCombinations: undefined } },
    'shadow Page Spec must declare non-empty unique metadata.validatedCombinations.'
  ],
  [
    'shadow-with-wrong-combination',
    { ...splitRuleWizard, metadata: { ...splitRuleWizard.metadata, validatedCombinations: ['form.grouped'] } },
    'metadata.validatedCombinations must reference verified policy combinations for the selected family and template.'
  ],
  [
    'non-wizard-guide',
    { ...settlementForm, form: { ...settlementForm.form, wizardGuide: { title: '不应出现', text: '分组表单不能使用 Wizard 引导区。' } } },
    'form.wizardGuide is reserved for template-10-wizard step forms.'
  ],
  [
    'default-list-with-shadow-summary',
    { ...merchantPilot, content: { ...merchantPilot.content, capabilities: [...merchantPilot.content.capabilities, 'summary.inline'] }, list: { ...merchantPilot.list, summary: { items: [{ key: 'count', label: '商户数', value: 4 }] } } },
    'template-03-query-list-regular cannot use inline summary or statistics cards.'
  ]
];

for (const [name, spec, expectedError] of directCases) {
  const errors = validatePageSpec(spec, { root });
  if (!errors.includes(expectedError)) failures.push(`${name}: expected error '${expectedError}', received ${errors.join(' | ')}`);
  else passed += 1;
}

if (failures.length) {
  console.error('page-spec-contract-tests: failed');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('page-spec-contract-tests: pass');
console.log(`- cases: ${passed}`);
