#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, isAbsolute, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const args = process.argv.slice(2);
const positional = [];
let resume = false;
let timeoutMs = 30_000;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === '--resume') {
    resume = true;
    continue;
  }
  if (arg === '--timeout-ms') {
    timeoutMs = Number(args[index + 1]);
    index += 1;
    continue;
  }
  positional.push(arg);
}

const [changeArg, ruleTemplate] = positional;
if (!changeArg || !ruleTemplate || positional.length !== 2 || !Number.isInteger(timeoutMs) || timeoutMs < 1_000 || timeoutMs > 30_000) {
  console.error('Usage: node scripts/prepare-boss-ledger-page-spec.mjs changes/{change-id} {rule-template-id} [--resume] [--timeout-ms 1000..30000]');
  process.exit(2);
}

const changesRoot = resolve(root, 'changes');
const changeDir = resolve(root, changeArg);
const changeRelative = relative(changesRoot, changeDir);
if (!changeRelative || changeRelative.startsWith('..') || isAbsolute(changeRelative)) {
  console.error('Change directory must be a child of changes/.');
  process.exit(2);
}

const statePath = resolve(changeDir, 'generation-state.json');
const rulesPath = resolve(changeDir, 'rules-read.md');
const pageSpecPath = resolve(changeDir, 'page-spec.json');

function writeState(state) {
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

function readState() {
  try {
    return JSON.parse(readFileSync(statePath, 'utf8'));
  } catch {
    return null;
  }
}

function printOutput(result) {
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
}

function runCheckpoint(state, name, script, scriptArgs) {
  const startedAt = new Date().toISOString();
  const started = Date.now();
  state.status = 'preparing';
  state.activeCheckpoint = name;
  state.nextAction = `等待 ${name} 完成`;
  writeState(state);

  const result = spawnSync(process.execPath, [resolve(root, script), ...scriptArgs], {
    cwd: root,
    encoding: 'utf8',
    timeout: timeoutMs
  });
  printOutput(result);
  const elapsedMs = Date.now() - started;
  const timedOut = result.error?.code === 'ETIMEDOUT';
  const checkpoint = {
    name,
    status: !result.error && result.status === 0 ? 'pass' : 'failed',
    startedAt,
    elapsedMs,
    timeoutMs
  };
  if (checkpoint.status === 'failed') checkpoint.error = timedOut ? `${name} exceeded ${timeoutMs}ms` : result.error?.message || `exit ${result.status ?? 'unknown'}`;
  state.checkpoints.push(checkpoint);
  delete state.activeCheckpoint;
  if (checkpoint.status === 'failed') {
    state.status = 'blocked';
    state.blockedAt = new Date().toISOString();
    state.nextAction = `修复 ${name} 后使用 --resume 继续；不要重复路由或重新创建 Change。`;
    writeState(state);
    throw new Error(checkpoint.error);
  }
  writeState(state);
}

try {
  let state;
  if (resume) {
    const previous = readState();
    if (!previous || existsSync(pageSpecPath) || !['blocked', 'ready-for-page-spec'].includes(previous.status)) {
      throw new Error('Only a prepared or blocked Change without page-spec.json can resume. Inspect generation-state.json for the last checkpoint.');
    }
    if (previous.ruleTemplate !== ruleTemplate) throw new Error('Resume rule template must match the original prepared Change.');
    if (previous.status === 'ready-for-page-spec' && existsSync(rulesPath)) {
      console.log(`boss-ledger-fast-prepare: resume (${changeArg})`);
      console.log('- rules already read; continue by writing page-spec.json');
      process.exit(0);
    }
    state = previous;
    state.status = 'preparing';
    state.resumedAt = new Date().toISOString();
    state.nextAction = '继续未通过的轻量预检。';
    writeState(state);
  } else {
    if (existsSync(changeDir)) throw new Error('Change directory already exists. Use --resume only for a prepared Change without page-spec.json.');
    mkdirSync(changeDir, { recursive: true });
    state = {
      schemaVersion: 1,
      system: 'boss-ledger',
      changeId: basename(changeDir),
      mode: 'fast',
      status: 'preparing',
      startedAt: new Date().toISOString(),
      timeoutMs,
      ruleTemplate,
      checkpoints: [{ name: 'change-directory', status: 'pass', completedAt: new Date().toISOString() }],
      nextAction: '执行轻量预检。'
    };
    writeState(state);
  }

  const passed = new Set(state.checkpoints.filter((checkpoint) => checkpoint.status === 'pass').map((checkpoint) => checkpoint.name));
  if (!passed.has('generation-policy')) runCheckpoint(state, 'generation-policy', 'scripts/check-boss-ledger-generation-policy.mjs', []);
  if (!passed.has('release-manifest')) runCheckpoint(state, 'release-manifest', 'scripts/verify-boss-ledger-release-manifest.mjs', []);
  if (!passed.has('context-packs')) runCheckpoint(state, 'context-packs', 'scripts/build-boss-ledger-context-packs.mjs', ['--check']);
  if (!passed.has('rules-read')) runCheckpoint(state, 'rules-read', 'scripts/read-boss-ledger-rules.mjs', [changeArg, ruleTemplate]);

  state.status = 'ready-for-page-spec';
  state.preparedAt = new Date().toISOString();
  state.nextAction = '在 90 秒内写入 page-spec.json、page-design.md 和最小交付说明，然后运行目标页构建与快速验收。';
  writeState(state);
  console.log(`boss-ledger-fast-prepare: pass (${changeArg})`);
  console.log('- next: write page-spec.json and page-design.md');
  console.log('- then: node scripts/check-boss-ledger-page-spec.mjs changes/{change-id}/page-spec.json');
  console.log('- then: node scripts/build-boss-ledger-page-spec.mjs changes/{change-id}/page-spec.json');
  console.log('- then: node scripts/verify-boss-ledger-page-spec.mjs --fast changes/{change-id}/page-spec.json');
} catch (error) {
  console.error(`boss-ledger-fast-prepare: failed\n- ${error.message}`);
  process.exit(1);
}
