#!/usr/bin/env node
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { classifyBossLedgerGeneration } from './lib/boss-ledger-generation-entry.mjs';

const root = process.cwd();
const request = '做一个老板管账的页面，可以点击新增分账规则进行配置，分账规则页面分为3步，带交互，可上一步下一步最后提交。第一步：规则名称、规则类型、规则渠道、渠道下级、生效日期。第二步：分账方、手续费、预计到账金额、预计扣账金额。第三步：预览页面。落地页展示完成，可以继续新增，也可以返回列表查看。';
let generatedChangeDir;

try {
  const fast = classifyBossLedgerGeneration(request);
  if (fast.status !== 'fast' || fast.recipe !== 'structured-wizard' || fast.route?.intent !== 'wizard') {
    throw new Error('Structured staged workflow did not select the verified fast recipe.');
  }

  const fallback = classifyBossLedgerGeneration('运营人员登记渠道联系人，填写姓名、手机号码和所属渠道后保存。');
  if (fallback.status !== 'fallback' || !fallback.next?.includes('受控自然语言生成')) {
    throw new Error('An unmatched request did not receive the controlled natural-language fallback.');
  }

  const result = spawnSync(process.execPath, [resolve(root, 'scripts/generate-boss-ledger-page.mjs'), '--request', request, '--json'], {
    cwd: root,
    encoding: 'utf8',
    timeout: 30_000
  });
  if (result.error?.code === 'ETIMEDOUT' || result.status !== 0) throw new Error(result.stderr || result.stdout || 'Generation entry failed.');
  const delivered = JSON.parse(result.stdout);
  if (delivered.status !== 'generated' || delivered.recipe !== 'structured-wizard') {
    throw new Error('Generation entry did not report the recipe-generated delivery.');
  }
  if (!/^changes\/\d{8}-[a-z0-9-]+$/.test(delivered.change)) {
    throw new Error(`Generation entry allocated an invalid Change id: ${delivered.change}`);
  }
  generatedChangeDir = resolve(root, delivered.change);
  if (!existsSync(resolve(generatedChangeDir, 'preview.html')) || !existsSync(resolve(generatedChangeDir, 'review.md'))) {
    throw new Error('Generation entry did not produce the preview and human review record.');
  }
  const review = readFileSync(resolve(generatedChangeDir, 'review.md'), 'utf8');
  if (!review.includes('静态预检已通过') || review.includes('浏览器自动验收')) {
    throw new Error('Generation entry did not preserve the manual-acceptance boundary.');
  }
  console.log('boss-ledger-generation-entry: pass');
} catch (error) {
  console.error(`boss-ledger-generation-entry: failed\n- ${error.message}`);
  process.exitCode = 1;
} finally {
  if (generatedChangeDir) rmSync(generatedChangeDir, { recursive: true, force: true });
}
