#!/usr/bin/env node
import { readJson, validatePageSpec } from './lib/open-platform-page-spec.mjs';
const root = process.cwd(); const pilot = readJson('changes/20260729-page-spec-open-platform-api-detail/page-spec.json'); const guide = readJson('changes/20260729-page-spec-open-platform-integration-guide/page-spec.json');
const cases = [
  ['pilot', pilot, false],
  ['integration-guide', guide, false],
  ['wrong-system', { ...pilot, ui: { ...pilot.ui, system: 'easy-account' } }, true],
  ['unknown-capability', { ...pilot, content: { capabilities: [...pilot.content.capabilities, 'docs.video'] } }, true],
  ['missing-current-catalog', { ...pilot, document: { ...pilot.document, sidebar: pilot.document.sidebar.map((group) => ({ ...group, items: group.items.map((item) => ({ ...item, current: false })) })) } }, true],
  ['missing-request-code', { ...pilot, document: { ...pilot.document, request: { language: 'JSON', code: '' } } }, true],
  ['guide-without-code', { ...guide, guide: { ...guide.guide, steps: guide.guide.steps.map((step) => ({ ...step, code: undefined })) } }, true]
];
const failures = cases.flatMap(([name, spec, shouldFail]) => { const errors = validatePageSpec(spec, { root }); return (errors.length > 0) === shouldFail ? [] : [`${name}: expected ${shouldFail ? 'rejection' : 'acceptance'}`]; });
if (failures.length) { console.error('open-platform-page-spec-contract-regression: failed'); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log(`open-platform-page-spec-contract-regression: pass (${cases.length} cases)`);
