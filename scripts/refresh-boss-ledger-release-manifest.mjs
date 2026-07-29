#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policy = JSON.parse(readFileSync(resolve(root, 'modules/boss-ledger/execution/generation-policy.json'), 'utf8'));
const files = [
  'modules/boss-ledger/director-rules/README.md',
  'modules/boss-ledger/director-rules/01-visual-constitution.md',
  'modules/boss-ledger/director-rules/02-template-application-rules.md',
  'modules/boss-ledger/director-rules/03-interaction-acceptance-rules.md',
  'modules/boss-ledger/DOMAIN.md',
  'modules/boss-ledger/domain.json',
  'modules/boss-ledger/templates.md',
  'modules/boss-ledger/templates/template-13-guided-form.md',
  'modules/boss-ledger/execution/generation-policy.json',
  'modules/boss-ledger/execution/page-spec.schema.json',
  'modules/boss-ledger/execution/rule-assertions.json',
  'modules/boss-ledger/execution/context-packs/core.md',
  'modules/boss-ledger/execution/context-packs/list.md',
  'modules/boss-ledger/execution/context-packs/form.md',
  'modules/boss-ledger/execution/context-packs/detail.md',
  'modules/boss-ledger/execution/context-packs/result.md',
  'modules/boss-ledger/execution/renderer/page-spec-preview.template.html',
  'modules/boss-ledger/execution/renderer/page-spec-business.css',
  'modules/boss-ledger/execution/renderer/page-spec-runtime.js',
  'modules/boss-ledger/shell/preview.template.html',
  'modules/boss-ledger/shell/shell-runtime.js',
  'modules/boss-ledger/shell/shell.css',
  'modules/boss-ledger/shell/content-base.css',
  'modules/boss-ledger/assets/boss-logo.svg',
  'modules/boss-ledger/haipeng_A_happy_b111oss_with_a_big_beard_in_a_white_suit_front_vie_06d8a20a-8e56-4833-8592-73eeb5b35bb8 1.png',
  'scripts/lib/boss-ledger-page-spec.mjs',
  'scripts/check-boss-ledger-page-spec.mjs',
  'scripts/test-boss-ledger-page-spec-contract.mjs',
  'scripts/build-boss-ledger-page-spec.mjs',
  'scripts/verify-boss-ledger-page-spec.mjs',
  'scripts/check-boss-ledger-generation-policy.mjs',
  'scripts/check-boss-ledger-rule-coverage.mjs',
  'scripts/compare-boss-ledger-shadow.mjs',
  'scripts/run-boss-ledger-page-spec-fixture.mjs',
  'scripts/validate-boss-ledger-preview.mjs',
  'scripts/verify-boss-ledger-change.mjs',
  'scripts/validate-boss-ledger-page-spec-system.mjs',
  'scripts/read-boss-ledger-rules.mjs',
  'scripts/materialize-boss-ledger-capability-scenarios.mjs',
  'scripts/verify-boss-ledger-capability-scenarios.mjs',
  'modules/boss-ledger/execution/scenarios/capability-scenarios.mjs'
];
const hashes = Object.fromEntries(files.map((file) => [file, createHash('sha256').update(readFileSync(resolve(root, file))).digest('hex')]));
const manifest = {
  schemaVersion: 1,
  system: 'boss-ledger',
  releaseVersion: policy.policyVersion,
  rulesVersion: '1.3.0',
  policyVersion: policy.policyVersion,
  pageSpecSchemaVersion: 1,
  rendererVersion: 1,
  shellVersion: 1,
  hashes
};
const destination = resolve(root, 'modules/boss-ledger/execution/release-manifest.json');
writeFileSync(destination, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Boss Ledger release manifest refreshed: ${destination}`);
console.log(`- version: ${manifest.releaseVersion}`);
console.log(`- bound files: ${files.length}`);
