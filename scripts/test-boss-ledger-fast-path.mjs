#!/usr/bin/env node
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { resolveResources } from './resolve-resources.mjs';

const root = process.cwd();
const changesRoot = resolve(root, 'changes');
const changeDir = mkdtempSync(resolve(changesRoot, '.fast-path-test-'));
const changeArg = relative(root, changeDir);
const ruleTemplate = 'list.regular';

function run(args) {
  const result = spawnSync(process.execPath, [resolve(root, 'scripts/prepare-boss-ledger-page-spec.mjs'), ...args], {
    cwd: root,
    encoding: 'utf8'
  });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'Fast preparation failed.');
}

try {
  const routed = resolveResources('运营人员查询商户，支持高级查询、新增抽屉和详情抽屉', 'generate');
  if (routed.intent !== 'query-list' || !routed.commands?.prepare?.includes('prepare-boss-ledger-page-spec.mjs')) {
    throw new Error('A query-list request with a detail Drawer did not resolve to the fast preparation path.');
  }
  if (routed.resources.some((resource) => resource.startsWith('modules/shared/') && resource !== 'modules/shared/product.md')) {
    throw new Error('Boss Ledger generation must not load shared design, template, frontend, or quality rules.');
  }
  if (!routed.commands?.scaffold?.includes('scaffold-boss-ledger-page-spec.mjs') || JSON.stringify(routed).includes('legacy')) {
    throw new Error('A Page Spec request exposed a retired compatibility path.');
  }
  const formRouted = resolveResources('创建老板管账的登记渠道联系人基础表单页', 'generate');
  if (formRouted.execution?.mode !== 'shadow' || !formRouted.commands?.scaffold?.includes('scaffold-boss-ledger-page-spec.mjs')) {
    throw new Error('A shadow Page Spec form did not resolve to the fixed Page Spec path.');
  }
  if (formRouted.resources.some((resource) => resource.startsWith('modules/shared/') && resource !== 'modules/shared/product.md') || JSON.stringify(formRouted).includes('legacy')) {
    throw new Error('A shadow Page Spec form loaded a retired compatibility path.');
  }
  const dashboardRouted = resolveResources('创建老板管账经营概览仪表盘', 'generate');
  if (dashboardRouted.execution?.availability !== 'available'
    || dashboardRouted.execution?.mode !== 'page-spec-default'
    || !dashboardRouted.commands?.prepare?.includes('prepare-boss-ledger-page-spec.mjs')
    || JSON.stringify(dashboardRouted).includes('legacy')) {
    throw new Error('A Dashboard page did not resolve to the current Page Spec path.');
  }
  // mkdtemp creates the private test directory; remove it so the production command owns creation.
  rmSync(changeDir, { recursive: true, force: true });
  run([changeArg, ruleTemplate]);
  const statePath = resolve(changeDir, 'generation-state.json');
  if (!existsSync(statePath) || !existsSync(resolve(changeDir, 'rules-read.md'))) throw new Error('Fast preparation did not create its recovery evidence.');
  const state = JSON.parse(readFileSync(statePath, 'utf8'));
  if (state.status !== 'ready-for-page-spec') throw new Error(`Expected ready-for-page-spec, received ${state.status}.`);
  if (!['generation-policy', 'release-manifest', 'context-packs', 'rules-read'].every((name) => state.checkpoints.some((checkpoint) => checkpoint.name === name && checkpoint.status === 'pass'))) {
    throw new Error('Fast preparation did not record all required checkpoints.');
  }
  const checkpointCount = state.checkpoints.length;
  run([changeArg, ruleTemplate, '--resume']);
  const resumed = JSON.parse(readFileSync(statePath, 'utf8'));
  if (resumed.checkpoints.length !== checkpointCount) throw new Error('Resuming a prepared Change repeated completed preflight work.');
  console.log('boss-ledger-fast-path: pass');
} catch (error) {
  console.error(`boss-ledger-fast-path: failed\n- ${error.message}`);
  process.exitCode = 1;
} finally {
  rmSync(changeDir, { recursive: true, force: true });
}
