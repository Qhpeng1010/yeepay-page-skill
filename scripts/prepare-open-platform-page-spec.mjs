#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { basename, isAbsolute, relative, resolve } from 'node:path';

const [changeArg, family] = process.argv.slice(2);
if (!changeArg || !['api-document', 'integration-guide'].includes(family) || process.argv.length !== 4) {
  console.error('Usage: node scripts/prepare-open-platform-page-spec.mjs changes/{change-id} <api-document|integration-guide>');
  process.exit(2);
}

const root = process.cwd();
const changesRoot = resolve(root, 'changes');
const changeDir = resolve(root, changeArg);
const changeRelative = relative(changesRoot, changeDir);
if (!changeRelative || changeRelative.startsWith('..') || isAbsolute(changeRelative)) {
  console.error('Change directory must be a child of changes/.');
  process.exit(2);
}
if (existsSync(resolve(changeDir, 'page-spec.json'))) {
  console.error('Change already contains page-spec.json; use the existing Change route for modification.');
  process.exit(1);
}

mkdirSync(changeDir, { recursive: true });
const resources = [
  'modules/open-platform/director-rules/01-visual-constitution.md',
  'modules/open-platform/director-rules/02-template-application-rules.md',
  'modules/open-platform/director-rules/03-interaction-acceptance-rules.md',
  'modules/open-platform/execution/generation-policy.json',
  'modules/open-platform/execution/context-packs/core.md',
  `modules/open-platform/execution/context-packs/${family}.md`
];
writeFileSync(resolve(changeDir, 'rules-read.md'), `# Open Platform 规则读取清单\n\n- 页面类型：\`${family}\`\n\n${resources.map((resource) => `- ${resource}`).join('\n')}\n\n页面只可编辑 \`page-spec.json\`；Documentation Shell 和预览文件均由构建命令生成。\n`);
writeFileSync(resolve(changeDir, 'generation-state.json'), `${JSON.stringify({
  schemaVersion: 1,
  system: 'open-platform',
  changeId: basename(changeDir),
  family,
  status: 'ready-for-page-spec',
  nextAction: '写入包含原始需求的 page-spec.json 和 page-design.md，然后运行 coverage、check、build 和 verify。'
}, null, 2)}\n`);
console.log(`open-platform-page-spec-prepare: pass (${changeArg})`);
