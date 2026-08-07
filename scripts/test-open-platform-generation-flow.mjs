#!/usr/bin/env node
import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const change = `changes/20260806-open-platform-flow-${randomBytes(4).toString('hex')}`;
const changeDir = resolve(root, change);

function run(script, args) {
  const result = spawnSync(process.execPath, [resolve(root, script), ...args], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `${script} failed`);
}

try {
  run('scripts/prepare-open-platform-page-spec.mjs', [change, 'api-document']);
  const spec = {
    schemaVersion: 1,
    metadata: { changeId: change.split('/').pop(), pageName: '支付接口文档', family: 'api-document', templateId: 'api-detail', request: '提供支付接口文档，包含参数、请求、响应和错误码。', ruleRefs: ['OP-TPL-001', 'OP-TPL-002', 'OP-INT-002', 'OP-INT-003'] },
    ui: { system: 'open-platform', runtime: 'open-platform-page-spec', rendererVersion: 1 },
    content: { capabilities: ['docs.navigation', 'docs.anchors', 'docs.code', 'docs.copyCode', 'docs.parameterTable', 'docs.errorGuide', 'docs.previousNext'] },
    document: {
      title: '支付接口', summary: '创建支付订单。', scope: '服务端调用。', previous: '签名说明', next: '订单查询', flow: ['准备参数', '发送请求', '处理结果'],
      sidebar: [{ label: '支付服务', items: [{ key: 'create-payment', label: '创建支付', anchor: 'overview', current: true }]}],
      toc: [{ label: '接口说明', anchor: 'overview' }, { label: '请求参数', anchor: 'parameters' }, { label: '请求示例', anchor: 'request-example' }],
      overview: '创建支付订单并返回支付凭证。', parameters: [{ name: 'merchantOrderNo', type: 'string', required: true, description: '商户订单号。' }],
      request: { language: 'JSON', code: '{"merchantOrderNo":"M202608060001"}' }, response: { language: 'JSON', code: '{"code":"0000"}' },
      errors: [{ code: 'PARAM_ERROR', message: '参数错误', action: '检查商户订单号。' }]
    }
  };
  writeFileSync(resolve(changeDir, 'page-spec.json'), `${JSON.stringify(spec, null, 2)}\n`);
  run('scripts/check-open-platform-requirement-coverage.mjs', ['--spec', `${change}/page-spec.json`]);
  run('scripts/check-open-platform-page-spec.mjs', [`${change}/page-spec.json`]);
  run('scripts/build-open-platform-page-spec.mjs', [`${change}/page-spec.json`]);
  run('scripts/verify-open-platform-page-spec.mjs', ['--fast', `${change}/page-spec.json`]);
  if (!existsSync(resolve(changeDir, 'preview.html'))) throw new Error('Preview was not generated.');
  console.log('open-platform-generation-flow: pass');
} catch (error) {
  console.error(`open-platform-generation-flow: failed\n- ${error.message}`);
  process.exitCode = 1;
} finally {
  rmSync(changeDir, { recursive: true, force: true });
}
