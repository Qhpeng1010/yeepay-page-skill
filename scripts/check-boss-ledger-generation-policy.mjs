#!/usr/bin/env node
// rule-assertion: policy.mode-boundary
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policyPath = resolve(root, 'modules/boss-ledger/execution/generation-policy.json');
const domainPath = resolve(root, 'modules/boss-ledger/domain.json');
const policy = JSON.parse(readFileSync(policyPath, 'utf8'));
const domain = JSON.parse(readFileSync(domainPath, 'utf8'));
const failures = [];

const allowedModes = new Set(['legacy', 'shadow', 'page-spec-default', 'page-spec-only']);
const allowedAvailability = new Set(['available', 'workflow-only', 'pending']);
const familyIds = new Set();
const ruleSource = [
  '01-visual-constitution.md',
  '02-template-application-rules.md',
  '03-interaction-acceptance-rules.md'
].map((file) => readFileSync(resolve(root, 'modules/boss-ledger/director-rules', file), 'utf8')).join('\n');
const knownRules = new Set(ruleSource.match(/BL-(?:VIS|TPL|INT)-\d{3}/g) || []);

if (policy.system !== 'boss-ledger') failures.push('policy.system must be boss-ledger');
if (!policy.policyVersion) failures.push('policyVersion is required');
for (const family of policy.families || []) {
  if (familyIds.has(family.id)) failures.push(`duplicate family: ${family.id}`);
  familyIds.add(family.id);
  if (!allowedModes.has(family.mode)) failures.push(`${family.id}: unsupported mode ${family.mode}`);
  if (!allowedAvailability.has(family.availability)) failures.push(`${family.id}: unsupported availability ${family.availability}`);
  if (family.availability !== 'available' && family.mode !== 'legacy') failures.push(`${family.id}: ${family.availability} family must remain legacy`);
  if (family.mode !== 'legacy' && family.availability !== 'available') failures.push(`${family.id}: Page Spec mode requires available status`);
  for (const [intent, mode] of Object.entries(family.intentModes || {})) {
    if (!family.intents?.includes(intent)) failures.push(`${family.id}: intent mode references unknown intent ${intent}`);
    if (!allowedModes.has(mode)) failures.push(`${family.id}/${intent}: unsupported mode ${mode}`);
    if (mode !== 'legacy' && family.availability !== 'available') failures.push(`${family.id}/${intent}: Page Spec mode requires available status`);
  }
  if (!Array.isArray(family.capabilities) || new Set(family.capabilities).size !== family.capabilities.length) failures.push(`${family.id}: capabilities must be a unique array`);
  for (const rule of family.ruleRefs || []) if (!knownRules.has(rule)) failures.push(`${family.id}: unknown rule ${rule}`);
}

for (const intent of domain.intents || []) {
  if (!intent.executionFamily) failures.push(`${intent.id}: executionFamily is required`);
  else if (!familyIds.has(intent.executionFamily)) failures.push(`${intent.id}: missing family ${intent.executionFamily}`);
}

for (const combination of policy.validatedCombinations || []) {
  const family = (policy.families || []).find((entry) => entry.id === combination.family);
  if (!family) {
    failures.push(`${combination.id}: missing family ${combination.family}`);
    continue;
  }
  if (!Array.isArray(combination.templateIds) || combination.templateIds.length === 0 || new Set(combination.templateIds).size !== combination.templateIds.length) {
    failures.push(`${combination.id}: templateIds must be a non-empty unique array`);
  }
  if (!['browser-business', 'browser-fixture'].includes(combination.evidence)) {
    failures.push(`${combination.id}: evidence must be browser-business or browser-fixture`);
  }
  for (const capability of combination.capabilities || []) {
    if (!family.capabilities.includes(capability)) failures.push(`${combination.id}: unsupported capability ${capability}`);
  }
  for (const rule of combination.ruleRefs || []) if (!knownRules.has(rule)) failures.push(`${combination.id}: unknown rule ${rule}`);
}

const execution = domain.adapter?.execution;
for (const context of Object.values(execution?.familyContexts || {})) {
  if (!existsSync(resolve(root, context))) failures.push(`missing family Context Pack: ${context}`);
}

if (failures.length) {
  console.error('generation-policy: failed');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('generation-policy: pass');
console.log(`- version: ${policy.policyVersion}`);
for (const family of policy.families) {
  const overrides = Object.entries(family.intentModes || {}).map(([intent, mode]) => `${intent}=${mode}`).join(', ');
  console.log(`- ${family.id}: ${family.availability} / ${family.mode}${overrides ? ` (${overrides})` : ''}`);
}
