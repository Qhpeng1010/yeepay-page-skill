#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, symlinkSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const changeArg = process.argv[2];
const materializeVendor = process.argv.includes('--materialize-vendor');
if (!changeArg) {
  console.error('Usage: node scripts/scaffold-boss-ledger-preview.mjs changes/{change-id}');
  process.exit(2);
}

const root = process.cwd();
const changesRoot = resolve(root, 'changes');
const target = resolve(root, changeArg);
if (!target.startsWith(`${changesRoot}/`) || basename(target) === 'changes') {
  console.error('Target must be a child directory under changes/.');
  process.exit(2);
}

if (!existsSync(resolve(target, 'rules-read.md'))) {
  console.error('rules-read.md is missing. Run scripts/read-boss-ledger-rules.mjs with the selected content template before scaffolding.');
  process.exit(1);
}

const templateRoot = resolve(root, 'modules/boss-ledger/shell');
const vendorSource = resolve(templateRoot, 'vendor');
const rulesManifest = readFileSync(resolve(target, 'rules-read.md'), 'utf8');
const usesWizardTemplate = /template-10-wizard\.md/.test(rulesManifest);
if (!existsSync(vendorSource)) {
  console.error('Canonical vendor runtime is missing: modules/boss-ledger/shell/vendor');
  process.exit(1);
}
if (existsSync(resolve(target, 'preview.html'))) {
  console.error('preview.html already exists; scaffold refuses to overwrite an existing page.');
  process.exit(1);
}

mkdirSync(target, { recursive: true });
mkdirSync(resolve(target, 'assets'), { recursive: true });
cpSync(resolve(templateRoot, 'preview.template.html'), resolve(target, 'preview.html'));
cpSync(resolve(templateRoot, usesWizardTemplate ? 'wizard-preview-app.template.js' : 'preview-app.template.js'), resolve(target, 'preview-app.js'));
cpSync(resolve(templateRoot, 'shell-runtime.js'), resolve(target, 'shell-runtime.js'));
cpSync(resolve(templateRoot, 'shell.css'), resolve(target, 'shell.css'));
cpSync(resolve(templateRoot, 'content-base.css'), resolve(target, 'content-base.css'));
cpSync(resolve(templateRoot, usesWizardTemplate ? 'wizard-business.css' : 'business.css'), resolve(target, 'business.css'));
const targetVendor = resolve(target, 'vendor');
if (materializeVendor) {
  cpSync(vendorSource, targetVendor, { recursive: true });
} else {
  // Development previews share the canonical runtime to avoid copying ~MBs per Change.
  symlinkSync('../../modules/boss-ledger/shell/vendor', targetVendor, 'dir');
}
cpSync(resolve(root, 'modules/boss-ledger/assets/boss-logo.svg'), resolve(target, 'assets/boss-logo.svg'));
if (usesWizardTemplate) {
  cpSync(resolve(root, 'modules/boss-ledger/haipeng_A_happy_b111oss_with_a_big_beard_in_a_white_suit_front_vie_06d8a20a-8e56-4833-8592-73eeb5b35bb8 1.png'), resolve(target, 'assets/wizard-guide.png'));
}

console.log(`Boss Ledger preview scaffolded: ${target}`);
console.log(`Fixed files: preview.html, shell-runtime.js, shell.css, content-base.css, vendor/${materializeVendor ? ' (materialized)' : ' (shared symlink)'}, assets/boss-logo.svg`);
console.log(`Template mode: ${usesWizardTemplate ? 'wizard' : 'standard'}`);
console.log('Editable files: preview-app.js, business.css');
