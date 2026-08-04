#!/usr/bin/env node
// rule-assertion: contract.regression
// rule-assertion: visual.standalone-page-title
// rule-assertion: visual.guided-simple-layout
// rule-assertion: interaction.simple-page-actions
// rule-assertion: visual.result-composition
// rule-assertion: contract.result-composition
import { readFileSync, readdirSync } from 'node:fs';
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
const contactModal = scenarioSpec('01-contact-create');
const guidedForm = scenarioSpec('02-settlement-account-change');
const uploadWizard = scenarioSpec('05-settlement-import');
const simplePageForm = readJson(resolve(fixtureRoot, 'valid/simple-page-form.json'));
const runtimeSource = readFileSync(resolve(root, 'modules/boss-ledger/execution/renderer/page-spec-runtime.js'), 'utf8');
const businessCssSource = readFileSync(resolve(root, 'modules/boss-ledger/execution/renderer/page-spec-business.css'), 'utf8');
const buildSource = readFileSync(resolve(root, 'scripts/build-boss-ledger-page-spec.mjs'), 'utf8');
const previewValidatorSource = readFileSync(resolve(root, 'scripts/validate-boss-ledger-preview.mjs'), 'utf8');
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
    'simple-page-form-with-sticky-actions',
    { ...simplePageForm, content: { ...simplePageForm.content, capabilities: [...simplePageForm.content.capabilities, 'form.stickyActions'] }, form: { ...simplePageForm.form, stickyActions: true } },
    'form.page-simple uses inline actions and cannot declare form.stickyActions.'
  ],
  [
    'guided-form-with-sticky-actions',
    { ...guidedForm, content: { ...guidedForm.content, capabilities: [...guidedForm.content.capabilities, 'form.stickyActions'] }, form: { ...guidedForm.form, stickyActions: true } },
    'form.guided-simple uses inline actions and cannot declare form.stickyActions.'
  ],
  [
    'workflow-result-summary-without-capability',
    { ...uploadWizard, content: { ...uploadWizard.content, capabilities: uploadWizard.content.capabilities.filter((capability) => capability !== 'form.resultSummary') } },
    'form.submit.success.summary requires form.resultSummary.'
  ],
  [
    'modal-form-over-six-fields',
    {
      ...contactModal,
      form: {
        ...contactModal.form,
        fields: [...contactModal.form.fields,
          { key: 'department', label: '所属部门', control: 'input' },
          { key: 'agentName', label: '代理名称', control: 'input' },
          { key: 'role', label: '业务角色', control: 'input' }
        ]
      }
    },
    'Modal forms support at most 6 fields; use a Drawer form.'
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

if (runtimeSource.includes("h('h2', { className: 'boss-form-title' }, spec.metadata.pageName)")) {
  failures.push('standalone-form-page-title: independent form pages must not render a duplicate page heading.');
} else {
  passed += 1;
}

if (runtimeSource.includes("h('h2', { className: 'boss-detail-title' }, spec.metadata.pageName)")) {
  failures.push('standalone-detail-page-title: independent detail pages must not render a duplicate page heading.');
} else {
  passed += 1;
}

if (!runtimeSource.includes("['form.page-simple', 'form.guided-simple'].includes(spec.metadata.templateId)")
  || !runtimeSource.includes('boss-inline-form-actions')
  || !runtimeSource.includes('function BusinessGuide')
  || !runtimeSource.includes("src: './assets/guided-form-default.png'")) {
  failures.push('simple-form-runtime: simple pages must use inline actions and guided forms must render the default business illustration.');
} else {
  passed += 1;
}

if (!businessCssSource.includes('width: min(100%, 1200px)')
  || !businessCssSource.includes('padding-inline: 16px')
  || !businessCssSource.includes('justify-content: flex-start')
  || !businessCssSource.includes('gap: 16px')
  || !businessCssSource.includes('--boss-form-label-width: 136px')
  || !businessCssSource.includes('--boss-form-control-offset: var(--boss-form-label-width)')
  || !businessCssSource.includes('margin-left: var(--boss-form-control-offset)')
  || !runtimeSource.includes("labelCol: useSideLabel ? { flex: '136px' } : undefined")
  || !businessCssSource.includes('.boss-full-page-form.boss-inline-action-page { padding-bottom: 16px; }')
  || !buildSource.includes("resolve(changeDir, 'assets/guided-form-default.png')")) {
  failures.push('guided-form-layout: guided forms must use the 1200px layout with 16px insets, input-aligned inline actions, and a generated default illustration asset.');
} else {
  passed += 1;
}

const completedPageResult = "if (completed) return h('div', { className: 'boss-content-stack' }, h('section', { className: 'boss-result-page' }, formBody));";
if (!runtimeSource.includes('function renderWorkflowResult')
  || !runtimeSource.includes('function ResultSummary')
  || !runtimeSource.includes('function ResultFeedback')
  || !runtimeSource.includes(completedPageResult)
  || !businessCssSource.includes('.boss-result-summary-panel')
  || !businessCssSource.includes('.boss-result-feedback')
  || !businessCssSource.includes('grid-template-columns: repeat(2, minmax(0, 1fr))')) {
  failures.push('workflow-result-composition: results must leave form guides, use the official Result structure, and support optional summary and feedback regions.');
} else {
  passed += 1;
}

if (!previewValidatorSource.includes("pageSpec?.metadata?.family === 'list'")
  || !previewValidatorSource.includes('function hasExactCssClassSelector')) {
  failures.push('query-list-validator-scope: list-only inset checks must use the Page Spec family and exact CSS class selectors.');
} else {
  passed += 1;
}

if (!runtimeSource.includes("const DEFAULT_QUERY_DATE_PRESETS = ['今日', '近 7 日', '近 30 日']")
  || !runtimeSource.includes('function queryRowTops')
  || !runtimeSource.includes("'data-boss-query-measurement': 'actual-row-count'")
  || runtimeSource.includes('collapseThreshold')
  || !businessCssSource.includes('.boss-query-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));')
  || !businessCssSource.includes('.boss-query-date-range-field { grid-column: 1 / -1;')
  || !businessCssSource.includes('.boss-query-actions { display: flex; grid-column: 3; justify-self: end;')
  || !businessCssSource.includes('  .boss-query-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }')
  || !businessCssSource.includes('  .boss-query-grid { grid-template-columns: minmax(0, 1fr); gap: 0; }')
  || !businessCssSource.includes('width: max-content; min-width: 320px;')
  || !runtimeSource.includes('const selected = isSameQueryDateRange(value, range);')
  || !runtimeSource.includes("boss-query-date-preset${selected ? ' is-selected' : ''}")
  || !businessCssSource.includes('.boss-query-date-preset.is-selected')
  || !businessCssSource.includes('background: var(--boss-selected-bg) !important;')
  ) {
  failures.push('adaptive-query-layout: query lists must use responsive 3/2/1 grid columns with content-sized Labels and same-column controls, reserve unused final-row columns, use the default date shortcuts, show one active shortcut with the primary-derived selection background, use a dedicated date row, and measure actual-row overflow without field-count thresholds.');
} else {
  passed += 1;
}

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
