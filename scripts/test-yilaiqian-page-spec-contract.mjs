#!/usr/bin/env node
import { readJson, validatePageSpec } from './lib/yilaiqian-page-spec.mjs';

const root = process.cwd();
const pilot = readJson('changes/20260729-page-spec-yilaiqian-checkout/page-spec.json');
const failurePilot = readJson('changes/20260729-page-spec-yilaiqian-payment-failure/page-spec.json');
const cases = [
  ['pilot', pilot, false],
  ['failure-pilot', failurePilot, false],
  ['wrong-system', { ...pilot, ui: { ...pilot.ui, system: 'easy-account' } }, true],
  ['unknown-capability', { ...pilot, content: { capabilities: [...pilot.content.capabilities, 'payment.split'] } }, true],
  ['float-limit', { ...pilot, checkout: { ...pilot.checkout, amountLimitMinor: '100.50' } }, true],
  ['missing-method', { ...pilot, checkout: { ...pilot.checkout, paymentMethods: [] } }, true],
  ['unsupported-outcome', { ...failurePilot, checkout: { ...failurePilot.checkout, resultOutcome: 'processing' } }, true],
  ['failure-without-details', { ...failurePilot, checkout: { ...failurePilot.checkout, failure: { reason: '', action: '' } } }, true]
];
const failures = cases.flatMap(([name, spec, shouldFail]) => {
  const errors = validatePageSpec(spec, { root });
  return (errors.length > 0) === shouldFail ? [] : [`${name}: expected ${shouldFail ? 'rejection' : 'acceptance'}`];
});
if (failures.length) {
  console.error('yilaiqian-page-spec-contract-regression: failed');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`yilaiqian-page-spec-contract-regression: pass (${cases.length} cases)`);
