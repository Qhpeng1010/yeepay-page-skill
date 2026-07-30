#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const previewArg = process.argv[2];
const explicitRuleTemplate = process.argv[3];
if (!previewArg) {
  console.error('Usage: node scripts/refresh-and-verify-boss-ledger-change.mjs changes/{change-id}/preview.html [rule-template-id]');
  process.exit(2);
}
if (process.argv.length > 4) {
  console.error('Pass at most one logical rule template ID.');
  process.exit(2);
}

const root = process.cwd();
const previewPath = resolve(root, previewArg);
const changeDir = dirname(previewPath);
const manifestPath = resolve(changeDir, 'rules-read.md');

function run(label, command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', stdio: 'inherit' });
  if (result.error || result.status !== 0) {
    console.error(`${label}: failed`);
    process.exit(result.status ?? 1);
  }
}

let ruleTemplate = explicitRuleTemplate;
if (!ruleTemplate && existsSync(manifestPath)) {
  const manifest = readFileSync(manifestPath, 'utf8');
  const match = manifest.match(/^- Rule template: `?([^`\n]+)`?$/m);
  ruleTemplate = match?.[1]?.trim();
}
if (!ruleTemplate) {
  console.error('Cannot refresh rules without a rule template. Pass a logical ID such as list.regular.');
  process.exit(2);
}

run('skill-integrity', process.execPath, [resolve(root, 'scripts/check-yeepay-skill-integrity.mjs')]);
run('latest-rules-read', process.execPath, [resolve(root, 'scripts/read-boss-ledger-rules.mjs'), changeDir, ruleTemplate]);
run('change-verify', process.execPath, [resolve(root, 'scripts/verify-boss-ledger-change.mjs'), previewPath]);
