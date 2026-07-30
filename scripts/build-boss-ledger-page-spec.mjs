#!/usr/bin/env node
// rule-assertion: delivery.page-design
import { createHash } from 'node:crypto';
import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readlinkSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { basename, dirname, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  assertChangeSpecPath,
  expectedRuntimeMode,
  generatedPreviewApp,
  loadPolicy,
  pageSpecHash,
  readJson,
  validatePageSpec
} from './lib/boss-ledger-page-spec.mjs';

const specArg = process.argv.find((arg) => arg.endsWith('page-spec.json'));
const materializeVendor = process.argv.includes('--materialize-vendor');
if (!specArg) {
  console.error('Usage: node scripts/build-boss-ledger-page-spec.mjs changes/{change-id}/page-spec.json [--materialize-vendor]');
  process.exit(2);
}

function sha256File(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function validatePageDesign(changeDir, spec, policy) {
  const designPath = resolve(changeDir, 'page-design.md');
  if (!existsSync(designPath)) throw new Error('page-design.md is missing; selection evidence is required before build.');
  const design = readFileSync(designPath, 'utf8');
  const templateId = spec.metadata.templateId.replace(/\.md$/, '');
  const templateEvidence = [
    `Rule template: \`${templateId}\``,
    `Template: \`${templateId}\``,
    `Template: \`${templateId}.md\``
  ];
  const requiredLines = [
    '## Routing',
    `Family: \`${spec.metadata.family}\``,
    `Runtime mode: \`${spec.metadata.executionMode}\``,
    `Selection reason: ${spec.metadata.selectionReason}`,
    'Rejected candidates:',
    'Capabilities:',
    '## Assumptions',
    '## Rule References'
  ];
  requiredLines.forEach((line) => { if (!design.includes(line)) throw new Error(`page-design.md is missing required selection evidence: ${line}`); });
  if (spec.metadata.executionMode === 'shadow') {
    const combinationEvidence = `Validated combinations: ${spec.metadata.validatedCombinations.map((id) => `\`${id}\``).join('、')}`;
    if (!design.includes(combinationEvidence)) throw new Error(`page-design.md is missing required shadow evidence: ${combinationEvidence}`);
  }
  // Earlier reviewed design records may identify historical templates by Markdown filename.
  if (!templateEvidence.some((line) => design.includes(line))) {
    throw new Error(`page-design.md is missing required selection evidence: ${templateEvidence[0]}`);
  }
  spec.metadata.assumptions.forEach((assumption) => { if (!design.includes(assumption)) throw new Error(`page-design.md does not record assumption: ${assumption}`); });
  spec.metadata.ruleRefs.forEach((ruleId) => { if (!design.includes(ruleId)) throw new Error(`page-design.md does not reference selected rule: ${ruleId}`); });
}

try {
  const root = process.cwd();
  const specPath = assertChangeSpecPath(root, specArg);
  const changeDir = dirname(specPath);
  const changeRelative = relative(root, changeDir);
  const spec = readJson(specPath);
  const errors = validatePageSpec(spec, { root });
  if (errors.length) throw new Error(errors.join('\n'));
  const policy = loadPolicy(root);
  const mode = expectedRuntimeMode(policy, spec.metadata.family, spec.metadata.templateId);
  if (mode !== spec.metadata.executionMode) throw new Error('Page Spec execution mode does not match the active generation policy.');
  validatePageDesign(changeDir, spec, policy);
  if (spec.metadata.changeId !== basename(changeDir)) throw new Error('metadata.changeId must match the Change directory name.');
  if (!existsSync(resolve(changeDir, 'rules-read.md'))) throw new Error('rules-read.md is missing. Run the routed preflight first.');

  const shellRoot = resolve(root, 'modules/boss-ledger/shell');
  const rendererRoot = resolve(root, 'modules/boss-ledger/execution/renderer');
  const themeRoot = resolve(root, 'modules/boss-ledger/execution/theme');
  mkdirSync(resolve(changeDir, 'assets'), { recursive: true });
  const fixedCopies = [
    [resolve(rendererRoot, 'page-spec-preview.template.html'), resolve(changeDir, 'preview.html')],
    [resolve(rendererRoot, 'page-spec-runtime.js'), resolve(changeDir, 'page-spec-runtime.js')],
    [resolve(rendererRoot, 'page-spec-business.css'), resolve(changeDir, 'business.css')],
    [resolve(themeRoot, 'theme.css'), resolve(changeDir, 'theme.css')],
    [resolve(themeRoot, 'theme.js'), resolve(changeDir, 'theme.js')],
    [resolve(shellRoot, 'shell-runtime.js'), resolve(changeDir, 'shell-runtime.js')],
    [resolve(shellRoot, 'shell.css'), resolve(changeDir, 'shell.css')],
    [resolve(shellRoot, 'content-base.css'), resolve(changeDir, 'content-base.css')],
    [resolve(root, 'modules/boss-ledger/assets/boss-logo.svg'), resolve(changeDir, 'assets/boss-logo.svg')]
  ];
  if (spec.metadata.family === 'form' && spec.form?.steps) {
    fixedCopies.push([
      resolve(root, 'modules/boss-ledger/haipeng_A_happy_b111oss_with_a_big_beard_in_a_white_suit_front_vie_06d8a20a-8e56-4833-8592-73eeb5b35bb8 1.png'),
      resolve(changeDir, 'assets/wizard-guide.png')
    ]);
  }
  if (spec.metadata.templateId === 'form.guided-simple') {
    fixedCopies.push([
      resolve(root, 'modules/boss-ledger/haipeng_A_happy_b111oss_with_a_big_beard_in_a_white_suit_front_vie_06d8a20a-8e56-4833-8592-73eeb5b35bb8 1.png'),
      resolve(changeDir, 'assets/guided-form-default.png')
    ]);
  }
  fixedCopies.forEach(([source, target]) => cpSync(source, target));

  const vendorSource = resolve(shellRoot, 'vendor');
  const vendorTarget = resolve(changeDir, 'vendor');
  if (!existsSync(vendorTarget)) {
    if (materializeVendor) cpSync(vendorSource, vendorTarget, { recursive: true });
    else symlinkSync('../../modules/boss-ledger/shell/vendor', vendorTarget, 'dir');
  } else if (lstatSync(vendorTarget).isSymbolicLink() && readlinkSync(vendorTarget) !== '../../modules/boss-ledger/shell/vendor') {
    unlinkSync(vendorTarget);
    symlinkSync('../../modules/boss-ledger/shell/vendor', vendorTarget, 'dir');
  }

  const appPath = resolve(changeDir, 'preview-app.js');
  writeFileSync(appPath, generatedPreviewApp(spec));
  const buildRecord = {
    schemaVersion: 1,
    system: 'boss-ledger',
    policyVersion: policy.policyVersion,
    rendererVersion: spec.ui.rendererVersion,
    pageSpecHash: pageSpecHash(spec),
    generated: Object.fromEntries([
      ['preview-app.js', appPath],
      ...fixedCopies.map(([source, target]) => [relative(changeDir, target), target])
    ].map(([name, file]) => [name, sha256File(file)]))
  };
  writeFileSync(resolve(changeDir, 'page-spec-build.json'), `${JSON.stringify(buildRecord, null, 2)}\n`);

  const shadowEvidence = spec.metadata.validatedCombinations?.length ? `- [x] 已验证组合：${spec.metadata.validatedCombinations.join('、')}\n` : '';
  const checklist = `# ${spec.metadata.pageName} Page Spec 检查清单\n\n- [x] 系统：Boss Ledger\n- [x] 页面族：${spec.metadata.family}\n- [x] 规则模板：${spec.metadata.templateId}\n- [x] 运行模式：${spec.metadata.executionMode}\n${shadowEvidence}- [x] 能力：${spec.content.capabilities.join('、')}\n- [x] 规则：${spec.metadata.ruleRefs.join('、')}\n- [x] Page Spec 契约通过\n- [x] 固定渲染器与 canonical Shell 已构建\n- [x] 派生产物已记录哈希\n`;
  writeFileSync(resolve(changeDir, 'page-spec-checklist.md'), checklist);

  const reviewPath = resolve(changeDir, 'review.md');
  if (!existsSync(reviewPath)) {
    const review = `# ${spec.metadata.pageName} 验收记录\n\n## 静态预检\n\n- [ ] 运行 \`verify-boss-ledger-page-spec.mjs\` 并记录结果。\n\n## 人工验收\n\n- 预览：\`preview.html\`\n- [ ] 按业务需求检查信息、布局和状态。\n- [ ] 操作关键流程，确认校验、提交、返回或关闭后的结果。\n- [ ] 记录观察结果和确认状态。\n\n## 结论\n\n- 状态：待人工验收\n- 记录：\n`;
    writeFileSync(reviewPath, review);
  }

  const syntax = spawnSync(process.execPath, ['--check', appPath], { cwd: root, encoding: 'utf8' });
  if (syntax.status !== 0) throw new Error(syntax.stderr || 'Generated preview-app.js syntax check failed.');
  console.log(`boss-ledger-page-spec-build: pass (${changeRelative})`);
  console.log(`- page spec: ${pageSpecHash(spec)}`);
  console.log(`- policy: ${policy.policyVersion}`);
  console.log('- editable source: page-spec.json');
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
}
