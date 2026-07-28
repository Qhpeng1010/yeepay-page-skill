#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'SKILL.md',
  'modules/shared/design-system.md',
  'modules/shared/theme-routing.md',
  'modules/shared/template-routing.md',
  'modules/shared/page-templates.md',
  'modules/shared/components.md',
  'modules/shared/frontend.md',
  'modules/shared/quality.md',
  'modules/boss-ledger/design.md',
  'modules/boss-ledger/business-rules.md',
  'modules/boss-ledger/templates/template-01-framework-shell.md',
  'modules/boss-ledger/shell/preview.template.html',
  'modules/boss-ledger/shell/preview-app.template.js',
  'modules/boss-ledger/shell/business.css',
  'modules/boss-ledger/shell/shell-runtime.js',
  'modules/boss-ledger/shell/shell.css',
  'modules/boss-ledger/shell/content-base.css',
  'modules/boss-ledger/shell/vendor/antd-reset.css',
  'modules/boss-ledger/shell/vendor/react.production.min.js',
  'modules/boss-ledger/shell/vendor/react-dom.production.min.js',
  'modules/boss-ledger/shell/vendor/antd.min.js',
  'modules/boss-ledger/shell/vendor/ant-design-icons.umd.js',
  'scripts/validate-boss-ledger-preview.mjs',
  'modules/boss-ledger/shell/assets/boss-logo.svg',
  'scripts/read-boss-ledger-rules.mjs',
  'scripts/refresh-and-verify-boss-ledger-change.mjs',
  'scripts/scaffold-boss-ledger-preview.mjs',
  'scripts/verify-boss-ledger-change.mjs',
  'scripts/route-business.mjs',
  'scripts/resolve-resources.mjs',
  'scripts/validate-progressive-structure.mjs',
  'references/registry.yaml',
  'workflows/delivery.md',
];
const registry = JSON.parse(readFileSync(resolve(root, 'references/registry.yaml'), 'utf8'));
const adapterErrors = [];
for (const module of registry.modules || []) {
  [module.domain, module.contract].forEach((file) => {
    if (!existsSync(resolve(root, file))) adapterErrors.push(`${module.id}: missing ${file}`);
  });
  if (!existsSync(resolve(root, module.contract))) continue;
  const contract = JSON.parse(readFileSync(resolve(root, module.contract), 'utf8'));
  if (contract.module !== module.id) adapterErrors.push(`${module.id}: contract module must match registry id`);
  if (!contract.adapter?.resources) adapterErrors.push(`${module.id}: missing adapter.resources`);
  Object.entries(contract.adapter?.resources || {}).forEach(([stage, resources]) => {
    if (!Array.isArray(resources)) {
      adapterErrors.push(`${module.id}/${stage}: resources must be an array`);
      return;
    }
    resources.forEach((file) => {
      if (!file.endsWith('.md') || !existsSync(resolve(root, file))) adapterErrors.push(`${module.id}/${stage}: invalid Markdown resource ${file}`);
    });
  });
  const template = contract.adapter?.template;
  if (template) {
    const templateFiles = [
      ...(template.framework || []),
      ...((template.supportingRules || []).flatMap((rule) => rule.templates || [])),
      ...(contract.intents || []).flatMap((intent) => intent.template ? [intent.template] : [])
    ];
    templateFiles.forEach((file) => {
      const resource = `${template.directory}/${file}`;
      if (!file.endsWith('.md') || !existsSync(resolve(root, resource))) adapterErrors.push(`${module.id}: invalid template ${resource}`);
    });
  } else if ((contract.intents || []).some((intent) => intent.template)) {
    adapterErrors.push(`${module.id}: intents declare templates without adapter.template`);
  }
  Object.values(contract.adapter?.commands || {}).forEach((commands) => {
    Object.values(commands || {}).forEach((command) => {
      const match = String(command).match(/node\s+(scripts\/[^\s]+)/);
      if (match && !existsSync(resolve(root, match[1]))) adapterErrors.push(`${module.id}: missing command script ${match[1]}`);
    });
  });
}
const missing = requiredFiles.filter((file) => !existsSync(resolve(root, file)));
const forbiddenHistoricalRefs = [
  'changes/add-merchant-audit-page',
  '20260710-boss-ledger-settlement-record-query-list/preview.html',
];
function collectFiles(relativePath) {
  const absolutePath = resolve(root, relativePath);
  if (!existsSync(absolutePath)) return [];
  if (statSync(absolutePath).isFile()) return [relativePath];
  return readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    const child = `${relativePath}/${entry.name}`;
    return entry.isDirectory() ? collectFiles(child) : [child];
  });
}
const scannedText = collectFiles('SKILL.md')
  .concat(collectFiles('README.md'), collectFiles('scripts'), collectFiles('templates'))
  .filter((file) => file !== 'scripts/check-yeepay-skill-integrity.mjs')
  .filter((file) => /\.(?:md|mjs|js|css|html)$/.test(file))
  .map((file) => readFileSync(resolve(root, file), 'utf8'))
  .join('\n');
const forbidden = forbiddenHistoricalRefs.filter((value) => scannedText.includes(value));

if (missing.length || adapterErrors.length || forbidden.length) {
  console.error('skill-integrity: failed');
  missing.forEach((file) => console.error(`- missing: ${file}`));
  adapterErrors.forEach((error) => console.error(`- adapter: ${error}`));
  forbidden.forEach((value) => console.error(`- historical dependency in operational files: ${value}`));
  process.exit(1);
}

console.log('skill-integrity: pass');
console.log(`- required paths: ${requiredFiles.length}`);
console.log(`- registered module adapters: ${(registry.modules || []).length}`);
console.log('- canonical shell: modules/boss-ledger/shell/');
console.log('- rule preflight: scripts/read-boss-ledger-rules.mjs');
console.log('- latest-rule delivery gate: scripts/refresh-and-verify-boss-ledger-change.mjs');
console.log('- change gate: scripts/verify-boss-ledger-change.mjs');
