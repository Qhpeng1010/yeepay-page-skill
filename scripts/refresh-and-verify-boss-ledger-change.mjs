#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const previewArg = process.argv[2];
const explicitTemplates = process.argv.slice(3).flatMap((arg) => arg.split(',')).filter(Boolean).map((item) => basename(item));
if (!previewArg) {
  console.error('Usage: node scripts/refresh-and-verify-boss-ledger-change.mjs changes/{change-id}/preview.html [template-xx-name.md,...]');
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

let templates = explicitTemplates;
if (!templates.length && existsSync(manifestPath)) {
  const manifest = readFileSync(manifestPath, 'utf8');
  const match = manifest.match(/^- Selected business templates: (.+)$/m);
  templates = match ? match[1].split(',').map((item) => basename(item.trim())).filter(Boolean) : [];
}
if (!templates.length) {
  console.error('Cannot refresh rules without a selected business template. Pass the template filename explicitly.');
  process.exit(2);
}

run('skill-integrity', process.execPath, [resolve(root, 'scripts/check-yeepay-skill-integrity.mjs')]);
run('latest-rules-read', process.execPath, [resolve(root, 'scripts/read-boss-ledger-rules.mjs'), changeDir, templates.join(',')]);
run('change-verify', process.execPath, [resolve(root, 'scripts/verify-boss-ledger-change.mjs'), previewPath]);
