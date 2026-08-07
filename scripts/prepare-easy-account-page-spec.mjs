#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, isAbsolute, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const [changeArg, templateId] = process.argv.slice(2);
if (!changeArg || !templateId || process.argv.length !== 4) {
  console.error('Usage: node scripts/prepare-easy-account-page-spec.mjs changes/{change-id} {template-id}');
  process.exit(2);
}
const root = process.cwd();
const changesRoot = resolve(root, 'changes');
const changeDir = resolve(root, changeArg);
const changeRelative = relative(changesRoot, changeDir);
if (!changeRelative || changeRelative.startsWith('..') || isAbsolute(changeRelative)) {
  console.error('Change directory must be a child of changes/.');
  process.exit(2);
}
if (existsSync(resolve(changeDir, 'page-spec.json'))) {
  console.error('Change already contains page-spec.json; use the existing Change route for modification.');
  process.exit(1);
}
mkdirSync(changeDir, { recursive: true });
const result = spawnSync(process.execPath, [resolve(root, 'scripts/read-easy-account-rules.mjs'), changeArg, templateId], { cwd: root, encoding: 'utf8' });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.status !== 0) process.exit(result.status || 1);
const state = {
  schemaVersion: 1,
  system: 'easy-account',
  changeId: basename(changeDir),
  mode: 'controlled-page-spec',
  status: 'ready-for-page-spec',
  templateId,
  nextAction: '写入包含原始需求的 page-spec.json 和 page-design.md，然后运行 coverage、check、build 和 verify。'
};
writeFileSync(resolve(changeDir, 'generation-state.json'), `${JSON.stringify(state, null, 2)}\n`);
console.log(`easy-account-page-spec-prepare: pass (${changeArg})`);
