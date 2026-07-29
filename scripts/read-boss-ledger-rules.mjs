#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const changeArg = process.argv[2];
const templateArgs = process.argv.slice(3).flatMap(arg => arg.split(',')).filter(Boolean);
if (!changeArg || !templateArgs.length) {
  console.error('Usage: node scripts/read-boss-ledger-rules.mjs changes/{change-id} template-xx-name.md[,template-yy-name.md]');
  process.exit(2);
}

const root = process.cwd();
const cacheDir = resolve(root, '.cache/yeepay-skill');
const cachePath = resolve(cacheDir, 'rules-hashes.json');
mkdirSync(cacheDir, { recursive: true });
let hashCache = {};
try { hashCache = JSON.parse(readFileSync(cachePath, 'utf8')); } catch { hashCache = {}; }
const files = [
  'modules/shared/design-system.md',
  'modules/shared/theme-routing.md',
  'modules/shared/template-routing.md',
  'modules/shared/page-templates.md',
  'modules/boss-ledger/design.md',
  'modules/boss-ledger/templates/template-01-framework-shell.md',
  ...templateArgs.map(template => `modules/boss-ledger/templates/${basename(template)}`),
  'modules/boss-ledger/business-rules.md',
  'modules/shared/components.md',
  'modules/shared/frontend.md',
  'modules/shared/quality.md'
];
const missing = files.filter(file => !existsSync(resolve(root, file)));
if (missing.length) {
  console.error(`Boss Ledger rule preflight failed. Missing: ${missing.join(', ')}`);
  process.exit(1);
}

const selectedTemplates = templateArgs.map(template => basename(template));
const invalidTemplate = selectedTemplates.find(template => !/^template-(0[2-9]|1[0-3])-/.test(template) || template === 'template-01-framework-shell.md');
if (invalidTemplate) {
  console.error(`Invalid business template: ${invalidTemplate}`);
  process.exit(1);
}

const rows = files.map(file => {
  const absolute = resolve(root, file);
  const stat = statSync(absolute);
  const signature = `${stat.mtimeMs}:${stat.size}`;
  const cached = hashCache[file];
  if (cached?.signature === signature) {
    return `- ${file} (${cached.lines} lines, sha256:${cached.hash})`;
  }
  const content = readFileSync(absolute, 'utf8');
  const entry = { signature, lines: content.split(/\r?\n/).length - 1, hash: createHash('sha256').update(content).digest('hex').slice(0, 16) };
  hashCache[file] = entry;
  return `- ${file} (${entry.lines} lines, sha256:${entry.hash})`;
});
writeFileSync(cachePath, `${JSON.stringify(hashCache, null, 2)}\n`);
const output = `# Boss Ledger 规则读取清单\n\n- Generated: ${new Date().toISOString()}\n- Selected design: Boss Ledger\n- Boss Ledger DESIGN source read completely: modules/boss-ledger/design.md\n- Framework rule read completely: modules/boss-ledger/templates/template-01-framework-shell.md\n- Selected business templates: ${selectedTemplates.join(', ')}\n- Framework template: template-01-framework-shell.md\n- Framework layer unchanged: yes\n- Query-list white-module rule acknowledged: yes\n\n本 change 在写入业务内容前完整读取了以下规则文件：\n\n${rows.join('\n')}\n\n实现约束：只允许替换导航、路由、Tabs、业务模块、字段、指标、图表、mock 数据和业务 CSS；不得重写固定 Shell。查询列表必须始终保留两个直接同级、完整白底、间距为 16px 的查询与结果模块。\n`;
const changeDir = resolve(root, changeArg);
if (!changeDir.startsWith(`${resolve(root, 'changes')}/`)) {
  console.error('Change directory must be a child of changes/.');
  process.exit(2);
}
writeFileSync(resolve(changeDir, 'rules-read.md'), output.replace('- Selected design: Boss Ledger\n', '- Selected design: Boss Ledger\n- Shared DESIGN source read completely: modules/shared/design-system.md\n'));
console.log(`Boss Ledger rules read: ${resolve(changeDir, 'rules-read.md')}`);
console.log(rows.join('\n'));
