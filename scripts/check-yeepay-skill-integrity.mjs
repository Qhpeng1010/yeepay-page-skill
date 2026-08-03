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
  'modules/boss-ledger/business-rules.md',
  'modules/boss-ledger/execution/rule-template-registry.json',
  'modules/boss-ledger/execution/theme/theme-tokens.json',
  'modules/boss-ledger/execution/theme/theme.css',
  'modules/boss-ledger/execution/theme/theme.js',
  'modules/boss-ledger/execution/context-packs/index.md',
  'modules/boss-ledger/execution/context-packs/dashboard.md',
  'modules/boss-ledger/execution/context-packs/state.md',
  'modules/boss-ledger/shell/shell-runtime.js',
  'modules/boss-ledger/shell/shell.css',
  'modules/boss-ledger/shell/content-base.css',
  'modules/boss-ledger/shell/vendor/antd-reset.css',
  'modules/boss-ledger/shell/vendor/react.production.min.js',
  'modules/boss-ledger/shell/vendor/react-dom.production.min.js',
  'modules/boss-ledger/shell/vendor/antd.min.js',
  'modules/boss-ledger/shell/vendor/ant-design-icons.umd.js',
  'scripts/validate-boss-ledger-preview.mjs',
  'scripts/read-boss-ledger-rules.mjs',
  'scripts/build-boss-ledger-context-packs.mjs',
  'scripts/prepare-boss-ledger-page-spec.mjs',
  'scripts/test-boss-ledger-fast-path.mjs',
  'scripts/generate-boss-ledger-page.mjs',
  'scripts/lib/boss-ledger-generation-entry.mjs',
  'scripts/lib/boss-ledger-list-workbench-recipe.mjs',
  'scripts/test-boss-ledger-generation-entry.mjs',
  'scripts/test-boss-ledger-list-workbench-recipe.mjs',
  'scripts/compile-boss-ledger-list-workbench-recipe.mjs',
  'scripts/verify-boss-ledger-page-runtime.mjs',
  'scripts/route-business.mjs',
  'scripts/resolve-resources.mjs',
  'scripts/validate-progressive-structure.mjs',
  'references/registry.yaml',
  'workflows/delivery.md',
  'modules/boss-ledger/director-rules/README.md',
  'modules/boss-ledger/director-rules/01-visual-constitution.md',
  'modules/boss-ledger/director-rules/02-template-application-rules.md',
  'modules/boss-ledger/director-rules/03-interaction-acceptance-rules.md',
  'modules/boss-ledger/execution/generation-policy.json',
  'modules/boss-ledger/execution/page-spec.schema.json',
  'modules/boss-ledger/execution/rule-assertions.json',
  'modules/boss-ledger/execution/release-manifest.json',
  'modules/boss-ledger/execution/renderer/page-spec-preview.template.html',
  'modules/boss-ledger/execution/renderer/page-spec-business.css',
  'modules/boss-ledger/execution/renderer/page-spec-runtime.js',
  'scripts/check-boss-ledger-page-spec.mjs',
  'scripts/build-boss-ledger-page-spec.mjs',
  'scripts/scaffold-boss-ledger-page-spec.mjs',
  'scripts/verify-boss-ledger-page-spec.mjs',
  'scripts/verify-boss-ledger-release-manifest.mjs',
  'scripts/check-boss-ledger-generation-policy.mjs',
  'scripts/check-boss-ledger-rule-coverage.mjs',
  'scripts/set-boss-ledger-family-mode.mjs',
  'scripts/test-boss-ledger-page-spec-contract.mjs',
  'scripts/validate-boss-ledger-page-spec-system.mjs',
  'scripts/run-boss-ledger-page-spec-fixture.mjs',
  'modules/easy-account/director-rules/README.md',
  'modules/easy-account/director-rules/01-visual-constitution.md',
  'modules/easy-account/director-rules/02-template-application-rules.md',
  'modules/easy-account/director-rules/03-interaction-acceptance-rules.md',
  'modules/easy-account/execution/generation-policy.json',
  'modules/easy-account/execution/page-spec.schema.json',
  'modules/easy-account/execution/renderer/page-spec-preview.template.html',
  'modules/easy-account/execution/renderer/page-spec-business.css',
  'modules/easy-account/execution/renderer/page-spec-runtime.js',
  'scripts/check-easy-account-page-spec.mjs',
  'scripts/build-easy-account-page-spec.mjs',
  'scripts/scaffold-easy-account-page-spec.mjs',
  'scripts/verify-easy-account-page-spec.mjs',
  'scripts/test-easy-account-page-spec-contract.mjs',
  'scripts/validate-easy-account-page-spec-system.mjs',
  'modules/open-platform/director-rules/README.md',
  'modules/open-platform/director-rules/01-visual-constitution.md',
  'modules/open-platform/director-rules/02-template-application-rules.md',
  'modules/open-platform/director-rules/03-interaction-acceptance-rules.md',
  'modules/open-platform/execution/generation-policy.json',
  'modules/open-platform/execution/page-spec.schema.json',
  'modules/open-platform/execution/renderer/page-spec-preview.template.html',
  'modules/open-platform/execution/renderer/page-spec-business.css',
  'modules/open-platform/execution/renderer/page-spec-runtime.js',
  'scripts/check-open-platform-page-spec.mjs',
  'scripts/build-open-platform-page-spec.mjs',
  'scripts/scaffold-open-platform-page-spec.mjs',
  'scripts/verify-open-platform-page-spec.mjs',
  'scripts/test-open-platform-page-spec-contract.mjs',
  'scripts/validate-open-platform-page-spec-system.mjs',
  'modules/Yilaiqian Checkout Counter/director-rules/README.md',
  'modules/Yilaiqian Checkout Counter/director-rules/01-visual-constitution.md',
  'modules/Yilaiqian Checkout Counter/director-rules/02-template-application-rules.md',
  'modules/Yilaiqian Checkout Counter/director-rules/03-interaction-acceptance-rules.md',
  'modules/Yilaiqian Checkout Counter/execution/generation-policy.json',
  'modules/Yilaiqian Checkout Counter/execution/page-spec.schema.json',
  'modules/Yilaiqian Checkout Counter/execution/renderer/page-spec-preview.template.html',
  'modules/Yilaiqian Checkout Counter/execution/renderer/page-spec-business.css',
  'modules/Yilaiqian Checkout Counter/execution/renderer/page-spec-runtime.js',
  'modules/Yilaiqian Checkout Counter/execution/vendor/vue.global.prod.js',
  'modules/Yilaiqian Checkout Counter/execution/vendor/vant.min.js',
  'modules/Yilaiqian Checkout Counter/execution/vendor/vant.css',
  'modules/Yilaiqian Checkout Counter/execution/vendor/vant-touch-emulator.js',
  'scripts/check-yilaiqian-page-spec.mjs',
  'scripts/build-yilaiqian-page-spec.mjs',
  'scripts/scaffold-yilaiqian-page-spec.mjs',
  'scripts/verify-yilaiqian-page-spec.mjs',
  'scripts/test-yilaiqian-page-spec-contract.mjs',
  'scripts/validate-yilaiqian-page-spec-system.mjs',
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
  const execution = contract.adapter?.execution;
  if (execution) {
    [execution.policy, execution.templateRegistry, execution.contextIndex, execution.schema, execution.releaseManifest, execution.coreContext, ...Object.values(execution.familyContexts || {})]
      .filter(Boolean)
      .forEach((file) => {
        if (!existsSync(resolve(root, file))) adapterErrors.push(`${module.id}: missing execution resource ${file}`);
      });
    [execution.scaffoldCommand, execution.buildCommand, execution.verifyCommand].filter(Boolean).forEach((command) => {
      const match = String(command).match(/node\s+(scripts\/[^\s]+)/);
      if (!match || !existsSync(resolve(root, match[1]))) adapterErrors.push(`${module.id}: missing execution command ${command}`);
    });
  }
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
console.log('- Page Spec runtime gate: scripts/verify-boss-ledger-page-runtime.mjs');
