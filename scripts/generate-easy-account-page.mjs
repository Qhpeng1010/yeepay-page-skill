#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { classifyEasyAccountGeneration } from './lib/easy-account-generation-entry.mjs';

const root = process.cwd();
const args = process.argv.slice(2);

function arg(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : '';
}

function todayShanghai() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  return ['year', 'month', 'day'].map((type) => parts.find((part) => part.type === type)?.value).join('');
}

function slugFromRequest(request) {
  const knownSlugs = [
    [/账户管理/, 'account-workbench'], [/账户查询/, 'account-query'], [/结算账户/, 'settlement-account'],
    [/结算批次/, 'settlement-batch'], [/账务/, 'accounting-record'], [/门店/, 'store-management']
  ];
  return knownSlugs.find(([pattern]) => pattern.test(request))?.[1] || 'easy-account-page';
}

function isValidChangeArg(value) {
  return /^changes\/\d{8}-[a-z0-9-]+$/.test(value || '');
}

function allocateChange(request, requestedChange) {
  const requested = String(requestedChange || '').trim();
  if (isValidChangeArg(requested) && !existsSync(resolve(root, requested))) return requested;
  const base = `changes/${todayShanghai()}-${slugFromRequest(request)}`;
  let candidate = base;
  let suffix = 2;
  while (existsSync(resolve(root, candidate))) candidate = `${base}-${suffix++}`;
  return candidate;
}

function print(result, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  console.log(`easy-account-generation-entry: ${result.status}`);
  console.log(`- ${result.reason}`);
  if (result.pageName) console.log(`- page: ${result.pageName}`);
  if (result.change) console.log(`- change: ${result.change}`);
  if (result.next) console.log(`- next: ${result.next}`);
}

function generate(result, request, change) {
  const command = [resolve(root, 'scripts/compile-easy-account-list-workbench-recipe.mjs'), '--request', request, '--change', change];
  const executed = spawnSync(process.execPath, command, { cwd: root, encoding: 'utf8', timeout: 30_000 });
  if (executed.error?.code === 'ETIMEDOUT') throw new Error('快速生成超过 30 秒。');
  if (executed.error || executed.status !== 0) throw new Error(executed.stderr || executed.stdout || '快速生成失败。');
  return { ...result, status: 'generated', change, next: '静态预检已完成，打开 preview.html 进行人工验收。' };
}

function main() {
  const request = arg('--request');
  const requestedChange = arg('--change');
  const json = args.includes('--json');
  if (!request) throw new Error('Usage: node scripts/generate-easy-account-page.mjs --request "<业务需求>" [--change changes/<change-id>] [--json]');
  const decision = classifyEasyAccountGeneration(request);
  if (decision.status === 'fast') {
    const change = allocateChange(request, requestedChange);
    print(generate({ ...decision, requestedChange }, request, change), json);
    return;
  }
  print(decision, json);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    main();
  } catch (error) {
    console.error(`easy-account-generation-entry: failed\n- ${error.message}`);
    process.exitCode = 1;
  }
}
