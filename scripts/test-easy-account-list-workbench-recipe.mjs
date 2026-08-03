#!/usr/bin/env node
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { classifyEasyAccountGeneration } from './lib/easy-account-generation-entry.mjs';
import { compileEasyAccountListWorkbench, parseEasyAccountListWorkbenchRequest } from './lib/easy-account-list-workbench-recipe.mjs';

const root = process.cwd();
const request = `创建易账通的账户管理列表页。

支持按账户号码、账户名称、商户编号、商户名称、账户类型、账户状态、开户时间、创建时间、生效日期和失效日期查询，共 10 个查询条件。列表展示账户号码、账户名称、商户编号、商户名称、账户类型、账户状态、可用余额、冻结金额、创建时间、更新时间、开户时间、生效日期、失效日期、费率类型、服务费率、手续费率、手续费、创建人、最后修改人和配置状态，共 20 列。

点击新增账户，在右侧抽屉填写账户号码、账户名称、商户编号、商户名称、账户类型、账户状态、生效日期、费率类型、服务费率和手续费率，以上字段均必填；保存后关闭抽屉并把新记录显示在列表首行。

点击编辑，在右侧抽屉修改以上 10 个字段，保存后关闭抽屉并更新当前记录。

点击任一记录查看详情，在右侧抽屉只读展示完整账户信息，关闭后保留原列表和查询条件。

每条记录提供删除操作，删除前必须二次确认，确认后从列表移除并反馈删除成功。

不需要批量操作，默认每页 20 条。`;
const changeId = `20260803-easy-account-list-workbench-test-${randomBytes(4).toString('hex')}`;
const changeArg = `changes/${changeId}`;
const changeDir = resolve(root, changeArg);

try {
  const classified = classifyEasyAccountGeneration(request);
  if (classified.status !== 'fast' || classified.recipe !== 'list-workbench') throw new Error('The unified generation entry did not select the Easy Account list workbench recipe.');
  const parsed = parseEasyAccountListWorkbenchRequest(request);
  if (parsed.pageName !== '账户管理') throw new Error('List page name was not parsed.');
  if (parsed.queryLabels.length !== 10 || parsed.columnLabels.length !== 20) throw new Error('Query or table fields were not parsed from the request.');
  if (!parsed.operations.detail || !parsed.operations.create || !parsed.operations.edit || !parsed.operations.delete) throw new Error('The list workbench did not retain all four requested operations.');
  if (parsed.formLabels.length !== 10 || parsed.formLabels.at(-1) !== '手续费率') throw new Error('The list workbench did not expand the edit field reference to the create fields.');

  const compiled = compileEasyAccountListWorkbench({ rawRequest: request, changeId });
  if (!compiled.content.capabilities.includes('query.advanced') || compiled.content.capabilities.includes('query.basic')) throw new Error('More than six query fields must use advanced query mode.');
  if (compiled.list.query.collapseThreshold !== 6 || compiled.list.query.fields.filter((field) => field.advanced).length !== 4) throw new Error('Advanced query fields did not receive the collapse behavior.');
  if (!compiled.list.table.drawerDetail || compiled.list.table.primaryAction?.form?.fields.length !== 10) throw new Error('The list workbench did not compile detail and create drawers.');
  if (compiled.list.table.rows.some((row) => Object.values(row).some((value) => String(value).includes('NaN')))) throw new Error('Sample rows contain NaN text instead of typed values.');
  if (!compiled.list.table.primaryAction.form.recordDefaults?.accountNo) throw new Error('The create drawer is missing a stable account identifier default.');
  const actions = compiled.list.table.rowActions || [];
  if (!actions.some((action) => action.type === 'edit') || !actions.some((action) => action.type === 'delete')) throw new Error('The list workbench did not compile edit and delete row actions.');
  const deleteAction = actions.find((action) => action.type === 'delete');
  if (deleteAction.confirm?.reversible !== false || !deleteAction.confirm?.successMessage) throw new Error('Delete confirmation is missing irreversible impact or success feedback.');

  const result = spawnSync(process.execPath, [resolve(root, 'scripts/compile-easy-account-list-workbench-recipe.mjs'), '--request', request, '--change', changeArg], { cwd: root, encoding: 'utf8', timeout: 30_000 });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'List workbench compiler failed.');
  if (!existsSync(resolve(changeDir, 'preview.html')) || !existsSync(resolve(changeDir, 'review.md'))) throw new Error('List workbench compiler did not produce preview and review artifacts.');
  const spec = JSON.parse(readFileSync(resolve(changeDir, 'page-spec.json'), 'utf8'));
  if (!spec.content.capabilities.includes('table.deleteAction') || !spec.list.table.rowActions.some((action) => action.type === 'delete')) throw new Error('Generated Page Spec does not expose the delete action.');
  const review = readFileSync(resolve(changeDir, 'review.md'), 'utf8');
  if (!review.includes('静态预检已通过') || review.includes('浏览器自动验收')) throw new Error('List workbench review record crossed the manual-acceptance boundary.');
  console.log('easy-account-list-workbench-recipe: pass');
} catch (error) {
  console.error(`easy-account-list-workbench-recipe: failed\n- ${error.message}`);
  process.exitCode = 1;
} finally {
  rmSync(changeDir, { recursive: true, force: true });
}
