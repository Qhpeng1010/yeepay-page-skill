#!/usr/bin/env node
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const fast = process.argv.includes('--fast');
const pilots = ['changes/20260729-page-spec-yilaiqian-checkout/page-spec.json','changes/20260729-page-spec-yilaiqian-payment-failure/page-spec.json'];
const steps = [
  ['skill-integrity', 'scripts/check-yeepay-skill-integrity.mjs', []],
  ['progressive-structure', 'scripts/validate-progressive-structure.mjs', []],
  ['contract-regression', 'scripts/test-yilaiqian-page-spec-contract.mjs', []],
  ...pilots.flatMap((pilot) => [
    [`${pilot}-contract`, 'scripts/check-yilaiqian-page-spec.mjs', [pilot]],
    [`${pilot}-build`, 'scripts/build-yilaiqian-page-spec.mjs', [pilot]],
    [`${pilot}-delivery`, 'scripts/verify-yilaiqian-page-spec.mjs', [...(fast ? ['--fast'] : []), pilot]]
  ])
];
for (const [label, script, args] of steps) {
  const result = spawnSync(process.execPath, [resolve(root, script), ...args], { cwd: root, encoding: 'utf8', stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`yilaiqian-page-spec-system: failed at ${label}`);
    process.exit(result.status || 1);
  }
}
console.log(`yilaiqian-page-spec-system: pass (${fast ? 'fast' : 'full'})`);
