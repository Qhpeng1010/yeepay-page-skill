#!/usr/bin/env node
import { validatePageSpec } from './lib/open-platform-page-spec.mjs';

const root = process.cwd();
const base = {
  schemaVersion: 1,
  metadata: {
    changeId: '20260806-open-platform-contract',
    pageName: '支付接口文档',
    family: 'api-document',
    templateId: 'api-detail',
    request: '为开发者提供支付接口文档，包含参数、请求示例、响应示例和错误码。',
    ruleRefs: ['OP-TPL-001', 'OP-TPL-002', 'OP-INT-002', 'OP-INT-003']
  },
  ui: { system: 'open-platform', runtime: 'open-platform-page-spec', rendererVersion: 1 },
  content: { capabilities: ['docs.navigation', 'docs.anchors', 'docs.code', 'docs.copyCode', 'docs.parameterTable', 'docs.errorGuide', 'docs.previousNext'] },
  document: {
    title: '支付接口', summary: '创建支付订单。', scope: '商户服务端调用。', previous: '签名说明', next: '查询订单',
    flow: ['准备请求参数', '发送支付请求', '处理响应结果'],
    sidebar: [{ label: '支付服务', items: [{ key: 'create-payment', label: '创建支付', anchor: 'overview', current: true }]}],
    toc: [{ label: '接口说明', anchor: 'overview' }, { label: '请求参数', anchor: 'parameters' }, { label: '请求示例', anchor: 'request-example' }],
    overview: '创建支付订单并返回支付凭证。',
    parameters: [{ name: 'merchantOrderNo', type: 'string', required: true, description: '商户订单号。' }],
    request: { language: 'JSON', code: '{"merchantOrderNo":"M202608060001"}' },
    response: { language: 'JSON', code: '{"code":"0000"}' },
    errors: [{ code: 'PARAM_ERROR', message: '参数错误', action: '检查商户订单号。' }]
  }
};
const guide = {
  ...base,
  metadata: { ...base.metadata, changeId: '20260806-open-platform-guide', pageName: '支付接入指南', family: 'integration-guide', templateId: 'integration-guide', request: '提供支付接入指南，包含准备、配置和联调步骤。', ruleRefs: ['OP-TPL-001', 'OP-TPL-002', 'OP-INT-002'] },
  content: { capabilities: ['docs.navigation', 'docs.anchors', 'docs.flow', 'docs.code', 'docs.copyCode', 'docs.previousNext'] },
  document: undefined,
  guide: {
    title: '支付接入', summary: '完成支付服务接入。', scope: '服务端开发人员。', previous: '创建应用', next: '上线检查',
    flow: ['准备应用', '配置密钥', '联调上线'],
    sidebar: [{ label: '快速开始', items: [{ key: 'prepare', label: '准备应用', anchor: 'prepare', current: true }]}],
    toc: [{ label: '准备应用', anchor: 'prepare' }, { label: '配置密钥', anchor: 'configure' }, { label: '联调上线', anchor: 'launch' }],
    steps: [
      { key: 'prepare', title: '准备应用', summary: '创建并选择应用。', checklist: ['确认应用标识'] },
      { key: 'configure', title: '配置密钥', summary: '配置调用密钥。', checklist: ['保存商户密钥'], code: { language: 'Shell', code: 'export YOP_APP_KEY=demo' } },
      { key: 'launch', title: '联调上线', summary: '验证支付回调。', checklist: ['完成回调验证'] }
    ]
  }
};

const cases = [
  ['api document', base, false],
  ['integration guide', guide, false],
  ['missing request', { ...base, metadata: { ...base.metadata, request: '' } }, true],
  ['wrong system', { ...base, ui: { ...base.ui, system: 'easy-account' } }, true],
  ['unknown capability', { ...base, content: { capabilities: [...base.content.capabilities, 'docs.video'] } }, true],
  ['missing current catalog', { ...base, document: { ...base.document, sidebar: [{ ...base.document.sidebar[0], items: [{ ...base.document.sidebar[0].items[0], current: false }]}] } }, true],
  ['missing request code', { ...base, document: { ...base.document, request: { language: 'JSON', code: '' } } }, true],
  ['guide without code', { ...guide, guide: { ...guide.guide, steps: guide.guide.steps.map((step) => ({ ...step, code: undefined })) } }, true]
];

const failures = cases.flatMap(([name, spec, shouldFail]) => {
  const errors = validatePageSpec(spec, { root });
  return (errors.length > 0) === shouldFail ? [] : [`${name}: expected ${shouldFail ? 'rejection' : 'acceptance'}`];
});
if (failures.length) {
  console.error('open-platform-page-spec-contract-regression: failed');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`open-platform-page-spec-contract-regression: pass (${cases.length} cases)`);
