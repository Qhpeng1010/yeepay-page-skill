#!/usr/bin/env node
import { existsSync, writeFileSync } from 'node:fs';
import { basename, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { resolveResources } from './resolve-resources.mjs';
import { compileStructuredWizard } from './lib/boss-ledger-wizard-recipe.mjs';

const root = process.cwd();
const args = process.argv.slice(2);

function arg(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : '';
}

function run(label, script, scriptArgs) {
  const result = spawnSync(process.execPath, [resolve(root, script), ...scriptArgs], { cwd: root, encoding: 'utf8', stdio: 'inherit', timeout: 30_000 });
  if (result.error?.code === 'ETIMEDOUT') throw new Error(`${label} exceeded 30000ms.`);
  if (result.error || result.status !== 0) throw new Error(`${label} failed.`);
}

function pageDesign(spec) {
  const { metadata, content } = spec;
  return `# ${metadata.pageName} 页面设计\n\n## 需求\n\n- 使用结构化分阶段流程配方生成。\n- 按输入需求提供步骤字段、预览确认与提交后的明确去向。\n\n## 页面方案\n\n- 选用分阶段配置流程。\n- 页面骨架、步骤推进、只读预览、固定操作栏和结果反馈来自已验证流程配方。\n- 业务字段由编号步骤中的字段列表确定。\n\n## Routing\n\n- Family: \`${metadata.family}\`\n- Rule template: \`${metadata.templateId}\`\n- Runtime mode: \`${metadata.executionMode}\`\n- Validated combinations: ${metadata.validatedCombinations.map((id) => `\`${id}\``).join('、')}\n- Selection reason: ${metadata.selectionReason}\n- Rejected candidates: 当前需求包含连续步骤和提交前预览，不使用单阶段表单。\n- Capabilities: ${content.capabilities.join('、')}\n\n## Assumptions\n\n${metadata.assumptions.map((assumption) => `- ${assumption}`).join('\n')}\n\n## Rule References\n\n${metadata.ruleRefs.map((rule) => `- \`${rule}\``).join('\n')}\n`;
}

function requirement(spec) {
  return `# ${spec.metadata.pageName} 需求说明\n\n${spec.metadata.request}\n\n## 生成边界\n\n- 本页面由结构化流程配方确定性生成。\n- 静态预检通过后，预览交由人工验收。\n`;
}

function review(spec) {
  return `# ${spec.metadata.pageName} 验收记录\n\n## 静态预检\n\n- [x] Page Spec 契约、固定 Shell、组件引用、文案和响应式规则已通过。\n- [x] 生成产物与当前策略一致，静态预检通过。\n\n## 人工验收\n\n- 预览：\`preview.html\`\n- [ ] 按业务需求检查步骤字段、预览内容和完成结果。\n- [ ] 操作关键流程：必填校验、下一步、上一步保留输入、提交确认、继续新增和返回列表。\n- [ ] 记录观察结果和确认状态。\n\n## 结论\n\n- 状态：待人工验收\n- 记录：静态预检已通过；视觉和运行时交互仍待人工打开预览确认。\n`;
}

try {
  const started = Date.now();
  const request = arg('--request');
  const changeArg = arg('--change');
  if (!request || !changeArg || args.length !== 4) {
    throw new Error('Usage: node scripts/compile-boss-ledger-wizard-recipe.mjs --request "<业务需求>" --change changes/{change-id}');
  }
  const route = resolveResources(request, 'generate');
  const expectedResources = [
    'modules/boss-ledger/execution/context-packs/core.md',
    'modules/boss-ledger/execution/context-packs/index.md',
    'modules/boss-ledger/execution/context-packs/form.md'
  ];
  if (route.status !== 'resolved' || route.module !== 'boss-ledger' || route.intent !== 'wizard' || route.template !== 'form.staged-flow') {
    throw new Error('该需求未唯一命中老板管账的分阶段流程配方。');
  }
  if (JSON.stringify(route.resources) !== JSON.stringify(expectedResources)) {
    throw new Error('分阶段流程配方只能读取 Boss Ledger 的核心、索引和表单规则包。');
  }

  const changeDir = resolve(root, changeArg);
  const changesRoot = resolve(root, 'changes');
  if (!changeDir.startsWith(`${changesRoot}/`) || existsSync(changeDir)) {
    throw new Error('Change 必须是不存在的 changes/ 子目录。');
  }
  const changeId = basename(changeDir);
  const spec = compileStructuredWizard({ rawRequest: request, changeId });
  run('fast preparation', 'scripts/prepare-boss-ledger-page-spec.mjs', [changeArg, route.template]);
  writeFileSync(resolve(changeDir, 'requirement.md'), requirement(spec));
  writeFileSync(resolve(changeDir, 'page-spec.json'), `${JSON.stringify(spec, null, 2)}\n`);
  writeFileSync(resolve(changeDir, 'page-design.md'), pageDesign(spec));
  run('page-spec contract', 'scripts/check-boss-ledger-page-spec.mjs', [`${changeArg}/page-spec.json`]);
  run('page build', 'scripts/build-boss-ledger-page-spec.mjs', [`${changeArg}/page-spec.json`]);
  run('static preflight', 'scripts/verify-boss-ledger-page-spec.mjs', [`${changeArg}/page-spec.json`]);
  writeFileSync(resolve(changeDir, 'review.md'), review(spec));
  console.log(`boss-ledger-wizard-recipe: pass (${relative(root, changeDir)})`);
  console.log(`- elapsed: ${Date.now() - started}ms`);
  console.log('- route: structured staged workflow');
  console.log('- acceptance: static preflight passed; human review remains required');
} catch (error) {
  console.error(`boss-ledger-wizard-recipe: failed\n- ${error.message}`);
  process.exit(1);
}
