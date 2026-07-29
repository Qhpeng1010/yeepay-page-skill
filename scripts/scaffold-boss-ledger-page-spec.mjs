#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, symlinkSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const changeArg = process.argv[2];
const materializeVendor = process.argv.includes('--materialize-vendor');
if (!changeArg) {
  console.error('Usage: node scripts/scaffold-boss-ledger-page-spec.mjs changes/{change-id}');
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
  console.error('rules-read.md is missing. Run the routed Boss Ledger preflight before scaffolding.');
  process.exit(1);
}
if (!existsSync(resolve(target, 'page-spec.json'))) {
  console.error('page-spec.json is missing. Write and validate the declarative source before scaffolding.');
  process.exit(1);
}
if (existsSync(resolve(target, 'preview.html'))) {
  console.error('preview.html already exists; scaffold refuses to overwrite an existing delivery. Use the build command to refresh derived files.');
  process.exit(1);
}

const shellRoot = resolve(root, 'modules/boss-ledger/shell');
const rendererRoot = resolve(root, 'modules/boss-ledger/execution/renderer');
const vendorSource = resolve(shellRoot, 'vendor');
mkdirSync(resolve(target, 'assets'), { recursive: true });
cpSync(resolve(rendererRoot, 'page-spec-preview.template.html'), resolve(target, 'preview.html'));
cpSync(resolve(rendererRoot, 'page-spec-runtime.js'), resolve(target, 'page-spec-runtime.js'));
cpSync(resolve(rendererRoot, 'page-spec-business.css'), resolve(target, 'business.css'));
cpSync(resolve(shellRoot, 'shell-runtime.js'), resolve(target, 'shell-runtime.js'));
cpSync(resolve(shellRoot, 'shell.css'), resolve(target, 'shell.css'));
cpSync(resolve(shellRoot, 'content-base.css'), resolve(target, 'content-base.css'));
cpSync(resolve(root, 'modules/boss-ledger/assets/boss-logo.svg'), resolve(target, 'assets/boss-logo.svg'));

const targetVendor = resolve(target, 'vendor');
if (materializeVendor) {
  cpSync(vendorSource, targetVendor, { recursive: true });
} else {
  symlinkSync('../../modules/boss-ledger/shell/vendor', targetVendor, 'dir');
}

console.log(`Boss Ledger Page Spec scaffolded: ${target}`);
console.log('Editable source: page-spec.json');
console.log('Derived files: preview.html, preview-app.js, page-spec-runtime.js, business.css, Shell, vendor and assets');
