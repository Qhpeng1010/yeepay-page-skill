#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { basename, dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const fastMode = args.includes('--fast');
const previewArg = args.find((arg) => !arg.startsWith('--'));
if (!previewArg) {
  console.error('Usage: node scripts/verify-boss-ledger-change.mjs [--fast] changes/{change-id}/preview.html');
  process.exit(2);
}

const root = process.cwd();
const previewPath = resolve(root, previewArg);
const changeDir = dirname(previewPath);
const templateDir = resolve(root, 'modules/boss-ledger/shell');
const failures = [];

const rulesManifestPath = resolve(changeDir, 'rules-read.md');
if (!existsSync(rulesManifestPath)) {
  failures.push('rules-read.md is missing; run scripts/read-boss-ledger-rules.mjs before implementation');
} else {
  const manifest = readFileSync(rulesManifestPath, 'utf8');
  const mandatoryRuleFiles = [
    'modules/shared/design-system.md',
    'modules/shared/theme-routing.md',
    'modules/shared/template-routing.md',
    'modules/shared/page-templates.md',
    'modules/boss-ledger/design.md',
    'modules/boss-ledger/templates/template-01-framework-shell.md',
    'modules/boss-ledger/business-rules.md',
    'modules/shared/components.md',
    'modules/shared/frontend.md',
    'modules/shared/quality.md',
  ];
  const manifestRows = [...manifest.matchAll(/^- ((?:specs|modules)\/[^\s]+) \([^\n]*sha256:([a-f0-9]+)\)$/gm)];
  const manifestHashes = new Map(manifestRows.map((match) => [match[1], match[2]]));
  for (const file of mandatoryRuleFiles) {
    const filePath = resolve(root, file);
    if (!existsSync(filePath)) {
      failures.push(`current rule file is missing: ${file}`);
      continue;
    }
    const hash = createHash('sha256').update(readFileSync(filePath)).digest('hex').slice(0, 16);
    if (manifestHashes.get(file) !== hash) {
      failures.push(`rules-read.md is stale or does not prove the current ${file} was read; rerun scripts/read-boss-ledger-rules.mjs`);
    }
  }
  const selectedTemplatesMatch = manifest.match(/^- Selected business templates: (.+)$/m);
  const selectedTemplates = selectedTemplatesMatch
    ? selectedTemplatesMatch[1].split(',').map((template) => template.trim()).filter(Boolean)
    : [];
  if (!selectedTemplates.length) {
    failures.push('rules-read.md must name at least one selected business template');
  }
  for (const template of selectedTemplates) {
    const file = `modules/boss-ledger/templates/${template}`;
    const filePath = resolve(root, file);
    if (!existsSync(filePath)) {
      failures.push(`rules-read.md names a missing selected business template: ${file}`);
      continue;
    }
    const hash = createHash('sha256').update(readFileSync(filePath)).digest('hex').slice(0, 16);
    if (manifestHashes.get(file) !== hash) {
      failures.push(`rules-read.md is stale or does not prove the current selected template ${file} was read; rerun scripts/read-boss-ledger-rules.mjs`);
    }
  }
  for (const [file, recordedHash] of manifestHashes) {
    if (file === 'modules/boss-ledger/components.md' && !existsSync(resolve(root, file))) continue;
    const filePath = resolve(root, file);
    if (!existsSync(filePath)) {
      failures.push(`rules-read.md names a missing rule file: ${file}`);
      continue;
    }
    const currentHash = createHash('sha256').update(readFileSync(filePath)).digest('hex').slice(0, 16);
    if (recordedHash !== currentHash) {
      failures.push(`rules-read.md contains a stale hash for ${file}; rerun scripts/read-boss-ledger-rules.mjs`);
    }
  }
  if (manifestRows.length < mandatoryRuleFiles.length + selectedTemplates.length) {
    failures.push('rules-read.md must include the selected content template hash in addition to all shared rule hashes');
  }
  if (!/Boss Ledger DESIGN source read completely: modules\/boss-ledger\/design\.md/.test(manifest)
      || !/Framework rule read completely: modules\/boss-ledger\/templates\/template-01-framework-shell\.md/.test(manifest)) {
    failures.push('rules-read.md must explicitly confirm the complete Boss Ledger DESIGN and framework rule were read');
  }
}

function sameFile(actual, expected, label) {
  if (!existsSync(actual)) return failures.push(`${label} is missing`);
  if (!existsSync(expected)) return failures.push(`canonical ${label} is missing`);
  if (!readFileSync(actual).equals(readFileSync(expected))) failures.push(`${label} differs from the canonical shell asset`);
}

function compareTree(actualDir, expectedDir, label) {
  if (!existsSync(actualDir)) return failures.push(`${label} is missing`);
  const expectedFiles = readdirSync(expectedDir).filter((name) => statSync(resolve(expectedDir, name)).isFile());
  const actualFiles = readdirSync(actualDir).filter((name) => statSync(resolve(actualDir, name)).isFile());
  if (expectedFiles.join('\n') !== actualFiles.join('\n')) failures.push(`${label} file list differs from canonical assets`);
  expectedFiles.forEach((name) => sameFile(resolve(actualDir, name), resolve(expectedDir, name), `${label}/${name}`));
}

sameFile(previewPath, resolve(templateDir, 'preview.template.html'), 'preview.html');
sameFile(resolve(changeDir, 'shell-runtime.js'), resolve(templateDir, 'shell-runtime.js'), 'shell-runtime.js');
sameFile(resolve(changeDir, 'shell.css'), resolve(templateDir, 'shell.css'), 'shell.css');
sameFile(resolve(changeDir, 'content-base.css'), resolve(templateDir, 'content-base.css'), 'content-base.css');
sameFile(resolve(changeDir, 'assets/boss-logo.svg'), resolve(root, 'modules/boss-ledger/assets/boss-logo.svg'), 'assets/boss-logo.svg');
compareTree(resolve(changeDir, 'vendor'), resolve(templateDir, 'vendor'), 'vendor');

const businessCssPath = resolve(changeDir, 'business.css');
const appPath = resolve(changeDir, 'preview-app.js');
if (!existsSync(businessCssPath)) failures.push('business.css is missing');
if (!existsSync(appPath)) failures.push('preview-app.js is missing');
if (existsSync(businessCssPath) && /\.boss-shell(?=\s|:|\{|\.|#|\[|,|$)/im.test(readFileSync(businessCssPath, 'utf8'))) {
  failures.push('business.css overrides fixed .boss-shell selectors');
}
if (existsSync(appPath) && /(function|const|let|var)\s+BossLedgerShell\b|data-boss-shell-template-version/i.test(readFileSync(appPath, 'utf8'))) {
  failures.push('preview-app.js redefines the fixed BossLedgerShell runtime');
}
if (existsSync(appPath) && /<footer\b|React\.createElement\(\s*["']footer["']/i.test(readFileSync(appPath, 'utf8'))) {
  failures.push('preview-app.js renders a business footer; the platform footer is owned by BossLedgerShell');
}

if (failures.length) {
  console.error('canonical-shell: failed');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('canonical-shell: pass');
const validation = spawnSync(process.execPath, [resolve(root, 'scripts/validate-boss-ledger-preview.mjs'), ...(fastMode ? ['--fast'] : []), previewPath], {
  cwd: root,
  encoding: 'utf8',
  stdio: 'pipe'
});
process.stdout.write(validation.stdout || '');
process.stderr.write(validation.stderr || '');
process.exit(validation.status ?? 1);
