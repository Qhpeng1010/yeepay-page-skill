#!/usr/bin/env node
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { classifyEasyAccountGeneration } from './lib/easy-account-generation-entry.mjs';

const root = process.cwd();
const request = '创建易账通的账户查询列表页。支持按账户号码、账户状态查询。列表展示账户号码、账户名称、账户状态和可用余额。点击新增账户，在右侧抽屉填写账户号码、账户名称和账户状态。点击编辑，在右侧抽屉修改账户名称和账户状态。点击任一记录查看详情。每条记录提供删除操作，删除前需要二次确认。默认每页 20 条。';
let generatedChangeDir;

try {
  const fast = classifyEasyAccountGeneration(request);
  if (fast.status !== 'fast' || fast.recipe !== 'list-workbench' || fast.route?.intent !== 'query-list') throw new Error('Easy Account list workflow did not select the verified fast recipe.');
  const fallback = classifyEasyAccountGeneration('易账通运营人员登记渠道联系人，填写姓名、手机号码和所属渠道后保存。');
  if (fallback.status !== 'fallback' || !fallback.next?.includes('受控自然语言生成')) throw new Error('An unmatched Easy Account request did not receive the controlled natural-language fallback.');
  const result = spawnSync(process.execPath, [resolve(root, 'scripts/generate-easy-account-page.mjs'), '--request', request, '--json'], { cwd: root, encoding: 'utf8', timeout: 30_000 });
  if (result.error?.code === 'ETIMEDOUT' || result.status !== 0) throw new Error(result.stderr || result.stdout || 'Generation entry failed.');
  const delivered = JSON.parse(result.stdout);
  if (delivered.status !== 'generated' || delivered.recipe !== 'list-workbench') throw new Error('Generation entry did not report the recipe-generated delivery.');
  if (!/^changes\/\d{8}-[a-z0-9-]+$/.test(delivered.change)) throw new Error(`Generation entry allocated an invalid Change id: ${delivered.change}`);
  generatedChangeDir = resolve(root, delivered.change);
  if (!existsSync(resolve(generatedChangeDir, 'preview.html')) || !existsSync(resolve(generatedChangeDir, 'review.md'))) throw new Error('Generation entry did not produce the preview and human review record.');
  const review = readFileSync(resolve(generatedChangeDir, 'review.md'), 'utf8');
  if (!review.includes('静态预检已通过') || review.includes('浏览器自动验收')) throw new Error('Generation entry did not preserve the manual-acceptance boundary.');
  console.log('easy-account-generation-entry: pass');
} catch (error) {
  console.error(`easy-account-generation-entry: failed\n- ${error.message}`);
  process.exitCode = 1;
} finally {
  if (generatedChangeDir) rmSync(generatedChangeDir, { recursive: true, force: true });
}
