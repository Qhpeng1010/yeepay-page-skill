#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const specArg = args.includes('--spec') ? args[args.indexOf('--spec') + 1] : '';
if (!specArg) {
  console.error('Usage: node scripts/check-open-platform-requirement-coverage.mjs --spec changes/{change-id}/page-spec.json');
  process.exit(2);
}

try {
  const spec = JSON.parse(readFileSync(resolve(process.cwd(), specArg), 'utf8'));
  const request = String(spec.metadata?.request || '').trim();
  if (!request) throw new Error('metadata.request 缺失，无法执行需求覆盖校验。');
  if (spec.ui?.system !== 'open-platform') throw new Error('页面系统不匹配：期望 open-platform。');
  const content = spec.metadata.family === 'api-document' ? spec.document : spec.guide;
  if (!content || typeof content !== 'object') throw new Error('原始需求未覆盖到对应文档内容。');
  const sections = spec.metadata.family === 'api-document'
    ? ['overview', 'parameters', 'request', 'response', 'errors']
    : ['steps', 'toc', 'sidebar'];
  const missing = sections.filter((key) => {
    const value = content[key];
    return value === undefined || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && !value.trim());
  });
  if (missing.length) throw new Error(`原始需求未覆盖的内容区块：${missing.join('、')}`);
  console.log(`open-platform-requirement-coverage: pass (${specArg})`);
  console.log(`- family=${spec.metadata.family}, request=${request.length} chars, sections=${sections.length}`);
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
}
