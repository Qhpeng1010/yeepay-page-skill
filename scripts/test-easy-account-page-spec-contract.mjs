#!/usr/bin/env node
import { readJson, validatePageSpec } from './lib/easy-account-page-spec.mjs';

const root = process.cwd();
const pilot = readJson('changes/20260806-store-management/page-spec.json');
const basicPilot = {
  ...pilot,
  content: { ...pilot.content, capabilities: pilot.content.capabilities.filter((capability) => capability !== 'query.advanced').concat('query.basic') },
  list: { ...pilot.list, query: { ...pilot.list.query, fields: pilot.list.query.fields.slice(0, 3) } }
};
const cases = [
  ['current-list', pilot, false],
  ['wrong-system', { ...pilot, ui: { ...pilot.ui, system: 'boss-ledger' } }, true],
  ['unknown-capability', { ...pilot, content: { ...pilot.content, capabilities: [...pilot.content.capabilities, 'table.tree'] } }, true],
  ['too-many-basic-fields', { ...basicPilot, list: { ...basicPilot.list, query: { fields: [...basicPilot.list.query.fields, ...basicPilot.list.query.fields, { key: 'extra', label: '额外字段', control: 'input' }] } } }, true],
  ['unknown-rule', { ...pilot, metadata: { ...pilot.metadata, ruleRefs: [...pilot.metadata.ruleRefs, 'EA-VIS-999'] } }, true]
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
