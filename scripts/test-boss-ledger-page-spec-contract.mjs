#!/usr/bin/env node
// rule-assertion: contract.regression
import { readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { readJson, validatePageSpec } from './lib/boss-ledger-page-spec.mjs';
import { scenarios } from '../modules/boss-ledger/execution/scenarios/capability-scenarios.mjs';

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

const scenarioSpec = (id) => {
  const scenario = scenarios.find((candidate) => candidate.id === id);
  if (!scenario) throw new Error(`Capability scenario is missing: ${id}`);
  return scenario.spec;
};
const merchantPilot = scenarioSpec('11-settlement-rule-management');
const settlementForm = scenarioSpec('03-merchant-settlement-config');
const splitRuleQuery = scenarioSpec('06-split-rule-query');
const drawerCreateList = scenarioSpec('17-merchant-service-config-drawer-create');
const dashboard = scenarioSpec('19-operation-dashboard');
const simplePageForm = readJson(resolve(fixtureRoot, 'valid/simple-page-form.json'));
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
    { ...splitRuleQuery, list: { ...splitRuleQuery.list, table: { ...splitRuleQuery.list.table, rowActions: splitRuleQuery.list.table.rowActions.map((action) => action.key === 'disable' ? { ...action, confirm: { ...action.confirm, impact: '' } } : action) } } },
    'list.table.rowActions[1].confirm.impact is required.'
  ],
  [
    'form-failure-without-recovery-verification',
    {
      ...settlementForm,
      form: {
        ...settlementForm.form,
        verification: undefined,
        submit: {
          ...settlementForm.form.submit,
          failure: {
            trigger: { field: 'merchantNo', value: 'M-FAIL' },
            message: '保存失败。',
            recovery: '请修正商户编号后重新保存。'
          }
        }
      }
    },
    'form.submit.failure requires form.verification.validValues for recovery regression.'
  ],
  [
    'mode-override',
    { ...merchantPilot, metadata: { ...merchantPilot.metadata, executionMode: 'shadow', validatedCombinations: ['form.grouped'] } },
    'metadata.executionMode must equal policy mode page-spec-default for list.regular.'
  ],
  [
    'shadow-without-validated-combination',
    { ...settlementForm, metadata: { ...settlementForm.metadata, validatedCombinations: undefined } },
    'shadow Page Spec must declare non-empty unique metadata.validatedCombinations.'
  ],
  [
    'shadow-with-wrong-combination',
    { ...settlementForm, metadata: { ...settlementForm.metadata, validatedCombinations: ['form.guided-simple'] } },
    'metadata.validatedCombinations must reference verified policy combinations for the selected family and template.'
  ],
  [
    'simple-page-form-in-modal',
    { ...simplePageForm, form: { ...simplePageForm.form, presentation: 'modal' } },
    'form.page-simple requires simple fields in a page presentation.'
  ],
  [
    'non-wizard-guide',
    { ...settlementForm, form: { ...settlementForm.form, wizardGuide: { title: '不应出现', text: '分组表单不能使用 Wizard 引导区。' } } },
    'form.wizardGuide is reserved for form.staged-flow step forms.'
  ],
  [
    'default-list-with-shadow-summary',
    { ...merchantPilot, content: { ...merchantPilot.content, capabilities: [...merchantPilot.content.capabilities, 'summary.inline'] }, list: { ...merchantPilot.list, summary: { items: [{ key: 'count', label: '商户数', value: 4 }] } } },
    'list.regular cannot use inline summary or statistics cards.'
  ],
  [
    'standalone-drawer-template-is-not-a-route',
    { ...simplePageForm, metadata: { ...simplePageForm.metadata, templateId: 'form.drawer-simple' }, form: { ...simplePageForm.form, presentation: 'drawer' } },
    'metadata.templateId is invalid.'
  ],
  [
    'dashboard-missing-ranking',
    { ...dashboard, dashboard: { ...dashboard.dashboard, charts: dashboard.dashboard.charts.filter((chart) => chart.role !== 'ranking') } },
    'dashboard.charts requires at least one ranking chart.'
  ],
  [
    'dashboard-cannot-carry-a-list',
    { ...dashboard, list: drawerCreateList.list },
    'dashboard Page Spec cannot declare list.'
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
