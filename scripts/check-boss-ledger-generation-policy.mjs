#!/usr/bin/env node
// rule-assertion: policy.mode-boundary
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policyPath = resolve(root, 'modules/boss-ledger/execution/generation-policy.json');
const domainPath = resolve(root, 'modules/boss-ledger/domain.json');
const registryPath = resolve(root, 'modules/boss-ledger/execution/rule-template-registry.json');
const policy = JSON.parse(readFileSync(policyPath, 'utf8'));
const domain = JSON.parse(readFileSync(domainPath, 'utf8'));
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const failures = [];
const legacyDesignPath = ['modules', 'boss-ledger', 'design.md'].join('/');
const directorRulePaths = [
  'modules/boss-ledger/director-rules/01-visual-constitution.md',
  'modules/boss-ledger/director-rules/02-template-application-rules.md',
  'modules/boss-ledger/director-rules/03-interaction-acceptance-rules.md'
];

const allowedModes = new Set(['legacy', 'shadow', 'page-spec-default', 'page-spec-only']);
const allowedAvailability = new Set(['available', 'workflow-only', 'pending']);
const familyIds = new Set();
const ruleSource = [
  '01-visual-constitution.md',
  '02-template-application-rules.md',
  '03-interaction-acceptance-rules.md'
].map((file) => readFileSync(resolve(root, 'modules/boss-ledger/director-rules', file), 'utf8')).join('\n');
const knownRules = new Set(ruleSource.match(/BL-(?:VIS|TPL|INT)-\d{3}/g) || []);
const ruleTemplates = new Map((registry.templates || []).map((template) => [template.id, template]));

if (registry.system !== 'boss-ledger') failures.push('rule-template registry system must be boss-ledger');
if (registry.source !== 'modules/boss-ledger/director-rules/02-template-application-rules.md') failures.push('rule-template registry must be compiled from the template application rules');
if (!registry.templateVersion) failures.push('rule-template registry templateVersion is required');
if (ruleTemplates.size !== (registry.templates || []).length) failures.push('rule-template IDs must be unique');
for (const template of ruleTemplates.values()) {
  if (!template.family || !template.title || !template.selection) failures.push(`${template.id}: family, title, and selection are required`);
  for (const rule of template.ruleIds || []) if (!knownRules.has(rule)) failures.push(`${template.id}: unknown rule ${rule}`);
}

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
  if (!intent.templateId) failures.push(`${intent.id}: templateId is required`);
  else if (!ruleTemplates.has(intent.templateId)) failures.push(`${intent.id}: unknown rule template ${intent.templateId}`);
  else if (ruleTemplates.get(intent.templateId).family !== intent.executionFamily) failures.push(`${intent.id}: rule template ${intent.templateId} belongs to ${ruleTemplates.get(intent.templateId).family}, not ${intent.executionFamily}`);
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
  for (const templateId of combination.templateIds || []) {
    const template = ruleTemplates.get(templateId);
    if (!template) failures.push(`${combination.id}: unknown rule template ${templateId}`);
    else if (template.family !== combination.family) failures.push(`${combination.id}: rule template ${templateId} belongs to ${template.family}, not ${combination.family}`);
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
if (!execution?.templateRegistry || !existsSync(resolve(root, execution.templateRegistry))) failures.push('missing rule-template registry execution resource');
const themePaths = [execution?.theme?.tokens, execution?.theme?.css, execution?.theme?.runtime].filter(Boolean);
if (themePaths.length !== 3 || themePaths.some((file) => !existsSync(resolve(root, file)))) {
  failures.push('missing generated Boss Ledger theme execution resources');
} else {
  const theme = JSON.parse(readFileSync(resolve(root, execution.theme.tokens), 'utf8'));
  if (theme.system !== 'boss-ledger' || theme.source !== 'modules/boss-ledger/director-rules/01-visual-constitution.md') {
    failures.push('theme tokens must be compiled from the visual constitution');
  }
  if (!theme.tokens?.colorPrimary || !theme.tokens?.fontFamily || !theme.tokens?.borderRadius) {
    failures.push('generated theme tokens are incomplete');
  }
  const rendererTemplate = readFileSync(resolve(root, 'modules/boss-ledger/execution/renderer/page-spec-preview.template.html'), 'utf8');
  const rendererRuntime = readFileSync(resolve(root, 'modules/boss-ledger/execution/renderer/page-spec-runtime.js'), 'utf8');
  if (!rendererTemplate.includes('./theme.css') || !rendererTemplate.includes('./theme.js') || !rendererRuntime.includes('theme.antTokens')) {
    failures.push('Page Spec renderer must consume the generated Boss Ledger theme');
  }
}
if (!execution?.contextIndex || !existsSync(resolve(root, execution.contextIndex))) failures.push('missing rule-template index execution resource');
for (const context of Object.values(execution?.familyContexts || {})) {
  if (!existsSync(resolve(root, context))) failures.push(`missing family Context Pack: ${context}`);
}
if (domain.adapter?.template) failures.push('legacy adapter.template must not be configured for Boss Ledger');
for (const [stage, resources] of Object.entries(domain.adapter?.resources || {})) {
  for (const resource of resources || []) {
    if (resource.startsWith('modules/boss-ledger/templates/') || resource === legacyDesignPath) {
      failures.push(`${stage}: legacy Boss Ledger design inputs must not be active resources (${resource})`);
    }
  }
}
const expectedResources = {
  requirement: ['modules/shared/product.md', 'modules/boss-ledger/business-rules.md'],
  design: [directorRulePaths[0]],
  template: [directorRulePaths[1], directorRulePaths[2], execution?.contextIndex],
  generate: [],
  review: ['modules/boss-ledger/business-rules.md']
};
for (const [stage, expected] of Object.entries(expectedResources)) {
  const actual = domain.adapter?.resources?.[stage] || [];
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures.push(`${stage}: Boss Ledger active resources must match the director-rule execution boundary`);
  }
}
if (!execution?.legacyScaffoldCommand?.includes('scripts/scaffold-boss-ledger-preview.mjs')) {
  failures.push('legacy preview scaffold must be isolated as an execution-only fallback command');
}
if (!execution?.legacyVerifyCommand?.includes('scripts/refresh-and-verify-boss-ledger-change.mjs')) {
  failures.push('legacy preview verification must be isolated as an execution-only fallback command');
}
if (domain.adapter?.commands?.generate?.scaffold) {
  failures.push('Boss Ledger public generation commands must not expose the legacy preview scaffold');
}
const readRulesSource = readFileSync(resolve(root, 'scripts/read-boss-ledger-rules.mjs'), 'utf8');
const legacyVerifierSource = readFileSync(resolve(root, 'scripts/verify-boss-ledger-change.mjs'), 'utf8');
for (const [label, source] of [['rules-read', readRulesSource], ['legacy-verifier', legacyVerifierSource]]) {
  if (source.includes('modules/shared/frontend.md') || source.includes('modules/shared/quality.md')) {
    failures.push(`${label}: Boss Ledger rule evidence must not depend on shared presentation or quality rules`);
  }
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
