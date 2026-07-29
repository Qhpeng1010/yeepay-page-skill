#!/usr/bin/env node
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const fast = process.argv.includes('--fast');
const pilotSpec = 'changes/20260728-page-spec-merchant-query/page-spec.json';
const settlementFormSpec = 'changes/20260729-page-spec-merchant-settlement-config/page-spec.json';
const splitRuleWizardSpec = 'changes/20260729-page-spec-split-rule-create/page-spec.json';
const steps = [
  ['skill-integrity', 'scripts/check-yeepay-skill-integrity.mjs', []],
  ['progressive-structure', 'scripts/validate-progressive-structure.mjs', []],
  ['generation-policy', 'scripts/check-boss-ledger-generation-policy.mjs', []],
  ['rule-coverage', 'scripts/check-boss-ledger-rule-coverage.mjs', []],
  ['release-manifest', 'scripts/verify-boss-ledger-release-manifest.mjs', []],
  ['contract-regression', 'scripts/test-boss-ledger-page-spec-contract.mjs', []],
  ['capability-scenario-materialization', 'scripts/materialize-boss-ledger-capability-scenarios.mjs', []],
  ['capability-scenario-browser', 'scripts/verify-boss-ledger-capability-scenarios.mjs', []],
  ['form-fixture', 'scripts/run-boss-ledger-page-spec-fixture.mjs', [...(fast ? ['--fast'] : []), 'modules/boss-ledger/execution/fixtures/valid/grouped-form.json']],
  ['settlement-form-business', 'scripts/build-boss-ledger-page-spec.mjs', [settlementFormSpec]],
  ['settlement-form-delivery', 'scripts/verify-boss-ledger-page-spec.mjs', [...(fast ? ['--fast'] : []), settlementFormSpec]],
  ['split-rule-wizard-business', 'scripts/build-boss-ledger-page-spec.mjs', [splitRuleWizardSpec]],
  ['split-rule-wizard-delivery', 'scripts/verify-boss-ledger-page-spec.mjs', [...(fast ? ['--fast'] : []), splitRuleWizardSpec]],
  ['detail-fixture', 'scripts/run-boss-ledger-page-spec-fixture.mjs', [...(fast ? ['--fast'] : []), 'modules/boss-ledger/execution/fixtures/valid/grouped-detail.json']],
  ['shadow-comparison', 'scripts/compare-boss-ledger-shadow.mjs', [pilotSpec]],
  ['pilot-build', 'scripts/build-boss-ledger-page-spec.mjs', [pilotSpec]],
  ['pilot-delivery', 'scripts/verify-boss-ledger-page-spec.mjs', [...(fast ? ['--fast'] : []), pilotSpec]]
];

for (const [label, script, args] of steps) {
  const result = spawnSync(process.execPath, [resolve(root, script), ...args], { cwd: root, encoding: 'utf8', stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`boss-ledger-page-spec-system: failed at ${label}`);
    process.exit(result.status || 1);
  }
}
console.log(`boss-ledger-page-spec-system: pass (${fast ? 'fast' : 'full'})`);
