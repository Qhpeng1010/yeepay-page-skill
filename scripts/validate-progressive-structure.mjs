#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'references/registry.yaml',
  'scripts/route-business.mjs',
  'scripts/resolve-resources.mjs',
  'workflows/delivery.md'
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error('progressive-structure: failed');
  missing.forEach((file) => console.error(`- missing: ${file}`));
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(path.join(root, 'references/registry.yaml'), 'utf8'));
const errors = [];
for (const module of registry.modules || []) {
  for (const key of ['domain', 'contract']) {
    if (!fs.existsSync(path.join(root, module[key]))) errors.push(`${module.id}: missing ${module[key]}`);
  }
  const contract = JSON.parse(fs.readFileSync(path.join(root, module.contract), 'utf8'));
  if (contract.module !== module.id) errors.push(`${module.id}: contract module must match registry id`);
  if (!contract.adapter?.resources) errors.push(`${module.id}: missing adapter.resources`);
  if (!contract.intents?.length) errors.push(`${module.id}: no intents`);
  const execution = contract.adapter?.execution;
  if (execution) {
    [execution.policy, execution.schema, execution.releaseManifest, execution.coreContext, ...Object.values(execution.familyContexts || {})]
      .filter(Boolean)
      .forEach((resource) => {
        if (!fs.existsSync(path.join(root, resource))) errors.push(`${module.id}: missing execution resource ${resource}`);
      });
    const policy = fs.existsSync(path.join(root, execution.policy || ''))
      ? JSON.parse(fs.readFileSync(path.join(root, execution.policy), 'utf8'))
      : null;
    if (policy && policy.system !== module.id) errors.push(`${module.id}: execution policy system must match module id`);
    for (const intent of contract.intents || []) {
      if (intent.executionFamily && !policy?.families?.some((family) => family.id === intent.executionFamily)) {
        errors.push(`${module.id}/${intent.id}: missing execution family ${intent.executionFamily}`);
      }
    }
  }
  for (const [stage, resources] of Object.entries(contract.adapter?.resources || {})) {
    if (!Array.isArray(resources)) {
      errors.push(`${module.id}/${stage}: resources must be an array`);
      continue;
    }
    resources.forEach((resource) => {
      if (path.extname(resource) !== '.md' || !fs.existsSync(path.join(root, resource))) {
        errors.push(`${module.id}/${stage}: invalid Markdown resource ${resource}`);
      }
    });
  }
  const template = contract.adapter?.template;
  if (template) {
    if (!template.directory || !Array.isArray(template.stages) || !Array.isArray(template.framework)) {
      errors.push(`${module.id}: invalid adapter.template contract`);
    }
    [...(template.framework || []), ...((template.supportingRules || []).flatMap((rule) => rule.templates || []))]
      .forEach((name) => {
        const resource = path.join(template.directory || '', name);
        if (path.extname(resource) !== '.md' || !fs.existsSync(path.join(root, resource))) {
          errors.push(`${module.id}: invalid template resource ${resource}`);
        }
      });
  }
  for (const intent of contract.intents || []) {
    if (intent.template) {
      if (!template) {
        errors.push(`${module.id}/${intent.id}: declares a template without adapter.template`);
      } else {
        const resource = path.join(template.directory, intent.template);
        if (path.extname(resource) !== '.md' || !fs.existsSync(path.join(root, resource))) {
          errors.push(`${module.id}/${intent.id}: invalid Markdown template ${resource}`);
        }
      }
    }
  }
}

if (errors.length) {
  console.error('progressive-structure: failed');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('progressive-structure: pass');
console.log(`- required paths: ${required.length}`);
console.log(`- registered modules: ${(registry.modules || []).length}`);
console.log('- routing: registry -> DOMAIN.md -> domain.json adapter -> stage Markdown resources');
console.log('- canonical rule format: Markdown');
