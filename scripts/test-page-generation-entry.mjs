#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
function run(request, extra = []) {
  const result = spawnSync(process.execPath, [resolve(root, 'scripts/generate-page.mjs'), '--request', request, ...extra], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

function assertGeneratedReport(result, changeDir) {
  assert.equal(result.recipeName, result.recipe);
  assert.equal(result.outcome, 'generated');
  assert.equal(result.fallbackReason, null);
  const requiredTimings = ['routeMs', 'classifyMs', 'compileMs', 'prepareMs', 'coverageMs', 'checkMs', 'buildMs', 'verifyMs', 'totalMs'];
  requiredTimings.forEach((key) => assert.ok(Number.isInteger(result.timings[key]) && result.timings[key] >= 0, `Missing timing: ${key}`));
  const reportPath = resolve(changeDir, 'generation-report.json');
  assert.ok(existsSync(reportPath));
  const report = JSON.parse(readFileSync(reportPath, 'utf8'));
  assert.equal(report.recipeName, result.recipeName);
  assert.equal(report.outcome, 'generated');
  assert.deepEqual(report.timings, result.timings);
}

const generatedChangeDirs = [];
try {
  const textResult = spawnSync(process.execPath, [resolve(root, 'scripts/generate-page.mjs'), '--request', '老板管账，生成空状态页面。', '--text'], { cwd: root, encoding: 'utf8' });
  assert.equal(textResult.status, 0, textResult.stderr);
  assert.match(textResult.stdout, /^page-generation-entry: clarify/m);

  const boss = run('老板管账，查询商户结算记录，查询条件包括商户名称和状态，列表字段包括商户编号和结算金额。');
  assert.equal(boss.status, 'natural-generation');
  assert.equal(boss.route.module, 'boss-ledger');
  assert.deepEqual(boss.resources, [
    'modules/boss-ledger/execution/context-packs/core.md',
    'modules/boss-ledger/execution/context-packs/index.md',
    'modules/boss-ledger/execution/context-packs/list.md'
  ]);
  assert.equal(boss.recipe, undefined);

  const bossForm = run('老板管账，创建结算规则表单，包含规则名称、结算方式和生效日期。');
  assert.equal(bossForm.status, 'natural-generation');
  assert.equal(bossForm.route.intent, 'simple-page-form');

  const composite = run('做一个老板管账的分账规则管理页面。先展示分账规则查询列表，查询条件为规则名称、所属商户、规则状态；列表字段为规则名称、所属商户、生效时间、规则状态、操作（查看、编辑）。点击新增分账规则后进入分阶段配置：第1步基础信息（规则名称、所属商户），第2步分账方配置（分账方名称、分账账户、分账比例），第3步预览复核。提交成功后展示成功反馈，并支持返回分账规则列表；返回后保留原查询条件并展示新建规则。');
  assert.equal(composite.status, 'natural-generation');
  assert.equal(composite.route.intent, 'wizard');
  assert.equal(composite.route.composition, true);
  assert.deepEqual(composite.route.intents.map((intent) => intent.id), ['wizard', 'query-list', 'result']);
  assert.deepEqual(composite.route.families, ['form', 'list', 'result']);
  assert.ok(composite.resources.includes('modules/boss-ledger/execution/context-packs/list.md'));
  assert.ok(composite.resources.includes('modules/boss-ledger/execution/context-packs/form.md'));
  assert.ok(composite.resources.includes('modules/boss-ledger/execution/context-packs/result.md'));
  assert.match(composite.commands.prepare, /form\.staged-flow --flexible$/);
  assert.match(composite.commands.check, /--flexible$/);
  assert.match(composite.commands.build, /--flexible$/);
  assert.match(composite.commands.verify, /--flexible$/);

  const easy = run('易账通，创建账户查询列表，查询条件包括账户名称和状态，列表字段包括账户编号和可用余额。', ['--recipe', 'auto']);
  assert.equal(easy.status, 'generated');
  assert.equal(easy.route.module, 'easy-account');
  assert.equal(easy.recipe, 'list-workbench');
  assert.equal(easy.checks, 'passed');
  assert.equal(easy.humanAcceptance, 'pending');
  const easyChangeDir = resolve(root, easy.change);
  generatedChangeDirs.push(easyChangeDir);
  assert.ok(existsSync(resolve(easyChangeDir, 'preview.html')));
  assert.equal(easy.preview, `${easy.change}/preview.html`);
  assertGeneratedReport(easy, easyChangeDir);

  const bossFast = run('创建老板管账的商户结算查询列表。查询条件：商户名称、结算状态。列表字段：结算单号、商户名称、结算状态、结算金额。支持查看详情。', ['--recipe', 'auto']);
  assert.equal(bossFast.status, 'generated');
  assert.equal(bossFast.route.module, 'boss-ledger');
  assert.equal(bossFast.recipe, 'list-workbench');
  assert.ok(Number.isInteger(bossFast.elapsedMs) && bossFast.elapsedMs < 30_000);
  const bossChangeDir = resolve(root, bossFast.change);
  generatedChangeDirs.push(bossChangeDir);
  assert.ok(existsSync(resolve(bossChangeDir, 'preview.html')));
  assertGeneratedReport(bossFast, bossChangeDir);

  const linkedFast = run('创建老板管账的分账规则查询页面。查询条件：规则名称、规则状态。列表字段：规则编号、规则名称、规则状态。支持新增，新增使用新标签页，填写规则名称、规则状态，提交后展示成功页并返回列表。', ['--recipe', 'auto']);
  assert.equal(linkedFast.status, 'generated');
  assert.equal(linkedFast.recipe, 'linked-list-page-form');
  const linkedChangeDir = resolve(root, linkedFast.change);
  generatedChangeDirs.push(linkedChangeDir);
  assert.ok(existsSync(resolve(linkedChangeDir, 'preview.html')));
  assertGeneratedReport(linkedFast, linkedChangeDir);

  const fallback = run('创建老板管账的商户查询列表。查询条件：商户名称。列表字段：商户编号、商户名称、操作（渠道绑定）。', ['--recipe', 'auto']);
  assert.equal(fallback.status, 'natural-generation');
  assert.equal(fallback.outcome, 'natural-generation');
  assert.equal(fallback.recipeName, null);
  assert.match(fallback.fallbackReason, /未登记|配方/);
  assert.ok(Number.isInteger(fallback.timings.routeMs));
  assert.ok(Number.isInteger(fallback.timings.classifyMs));
  assert.ok(Number.isInteger(fallback.timings.totalMs));

  const open = run('易宝开放平台，编写支付接口 API 文档，包含请求参数和请求示例。');
  assert.equal(open.status, 'natural-generation');
  assert.equal(open.route.module, 'open-platform');
  assert.match(open.commands.prepare, /prepare-open-platform-page-spec/);
  assert.match(open.commands.coverage, /check-open-platform-requirement-coverage/);
  assert.match(open.commands.check, /check-open-platform-page-spec/);

  const implementationBlocked = run('易账通，生成业务概览 Dashboard。');
  assert.equal(implementationBlocked.status, 'blocked');
  assert.match(implementationBlocked.reason, /缺少可执行的规格与渲染器实现/);

  const clarify = run('老板管账，生成空状态页面。');
  assert.equal(clarify.status, 'clarify');
  assert.match(clarify.question, /依附具体业务页面/);

  console.log('page-generation-entry: pass');
} finally {
  generatedChangeDirs.forEach((directory) => rmSync(directory, { recursive: true, force: true }));
}
