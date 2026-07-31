#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { classifyBossLedgerGeneration } from './lib/boss-ledger-generation-entry.mjs';

const root = process.cwd();
const args = process.argv.slice(2);

function arg(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : '';
}

function print(result, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  console.log(`boss-ledger-generation-entry: ${result.status}`);
  console.log(`- ${result.reason}`);
  if (result.pageName) console.log(`- page: ${result.pageName}`);
  if (result.change) console.log(`- change: ${result.change}`);
  if (result.next) console.log(`- next: ${result.next}`);
}

function generate(result, request, change) {
  const command = [resolve(root, 'scripts/compile-boss-ledger-wizard-recipe.mjs'), '--request', request, '--change', change];
  const executed = spawnSync(process.execPath, command, { cwd: root, encoding: 'utf8', timeout: 30_000 });
  if (executed.error?.code === 'ETIMEDOUT') throw new Error('快速生成超过 30 秒。');
  if (executed.error || executed.status !== 0) throw new Error(executed.stderr || executed.stdout || '快速生成失败。');
  return {
    ...result,
    status: 'generated',
    change,
    next: '静态预检已完成，打开 preview.html 进行人工验收。'
  };
}

function main() {
  const request = arg('--request');
  const change = arg('--change');
  const json = args.includes('--json');
  if (!request) throw new Error('Usage: node scripts/generate-boss-ledger-page.mjs --request "<业务需求>" [--change changes/<change-id>] [--json]');

  const decision = classifyBossLedgerGeneration(request);
  if (decision.status === 'fast') {
    if (!change) throw new Error('命中快速配方时必须提供一个新的 changes/<change-id>。');
    print(generate(decision, request, change), json);
    return;
  }
  print(decision, json);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    main();
  } catch (error) {
    console.error(`boss-ledger-generation-entry: failed\n- ${error.message}`);
    process.exitCode = 1;
  }
}
