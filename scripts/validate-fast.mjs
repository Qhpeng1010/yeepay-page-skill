#!/usr/bin/env node
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const previewArg = process.argv[2];
if (!previewArg) {
  console.error('Usage: node scripts/validate-fast.mjs changes/{change-id}/preview.html');
  process.exit(2);
}

const root = process.cwd();
const previewPath = resolve(root, previewArg);
const appPath = resolve(dirname(previewPath), 'preview-app.js');

function run(label, args) {
  const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', stdio: 'inherit' });
  if (result.error || result.status !== 0) {
    console.error(`${label}: failed`);
    process.exit(result.status ?? 1);
  }
}

run('syntax', ['--check', appPath]);
run('fast-verify', [resolve(root, 'scripts/verify-boss-ledger-change.mjs'), '--fast', previewPath]);
console.log('validate-fast: pass (Chrome deferred to final delivery)');
