#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const changeArg = process.argv[2];
const templateId = process.argv[3];
if (!changeArg || !templateId || process.argv.length !== 4) {
  console.error('Usage: node scripts/read-easy-account-rules.mjs changes/{change-id} {template-id}');
  process.exit(2);
}

const root = process.cwd();
const family = templateId.startsWith('list.') ? 'list'
  : templateId.startsWith('form.') ? 'form'
    : templateId.startsWith('detail.') ? 'detail'
      : templateId.startsWith('result.') ? 'result' : null;
const files = [
  'modules/easy-account/director-rules/README.md',
  'modules/easy-account/director-rules/01-visual-constitution.md',
  'modules/easy-account/director-rules/02-template-application-rules.md',
  'modules/easy-account/director-rules/03-interaction-acceptance-rules.md',
  'modules/easy-account/execution/generation-policy.json',
  'modules/easy-account/execution/context-packs/core.md',
  'modules/easy-account/execution/context-packs/index.md',
  ...(family ? [`modules/easy-account/execution/context-packs/${family}.md`] : []),
  'modules/easy-account/business-rules.md'
];
if (!family) {
  console.error(`Unknown Easy Account template: ${templateId}`);
  process.exit(1);
}
const missing = files.filter((file) => !existsSync(resolve(root, file)));
if (missing.length) {
  console.error(`Easy Account rule preflight failed. Missing: ${missing.join(', ')}`);
  process.exit(1);
}
const rows = files.map((file) => {
  const absolute = resolve(root, file);
  const stat = statSync(absolute);
  const content = readFileSync(absolute, 'utf8');
  return `- ${file} (${content.split(/\r?\n/).length - 1} lines, sha256:${createHash('sha256').update(content).digest('hex').slice(0, 16)})`;
});
const changeDir = resolve(root, changeArg);
if (!changeDir.startsWith(`${resolve(root, 'changes')}/`)) {
  console.error('Change directory must be a child of changes/.');
  process.exit(2);
}
mkdirSync(changeDir, { recursive: true });
writeFileSync(resolve(changeDir, 'rules-read.md'), `# Easy Account 规则读取清单\n\n- Selected template: \`${templateId}\`\n- Selected family: \`${family}\`\n- Fixed Shell: renderer-owned; it is not a business template input.\n\n${rows.join('\n')}\n\n页面需求只能声明字段、数据、文案、状态和当前策略已开放的能力；固定渲染器负责 Shell、组件、主题和响应式实现。\n`);
console.log(`Easy Account rules read: ${resolve(changeDir, 'rules-read.md')}`);
console.log(rows.join('\n'));
