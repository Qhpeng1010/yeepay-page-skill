#!/usr/bin/env node
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { classifyBossLedgerGeneration } from './lib/boss-ledger-generation-entry.mjs';
import { compileListWorkbench, parseListWorkbenchRequest } from './lib/boss-ledger-list-workbench-recipe.mjs';

const root = process.cwd();
const request = `创建老板管账的分账规则管理列表页。

支持按规则名称、规则编号、商户编号、商户名称、规则状态、分账渠道、创建时间、更新时间、生效日期和失效日期查询，共 10 个查询条件。列表展示规则编号、规则名称、商户名称、商户编号、规则类型、分账渠道、渠道下级、规则状态、创建时间、更新时间、生效日期、失效日期、分账方式、分账周期、手续费率、待分账金额、预计到账金额、预计扣账金额、创建人和最后修改人，共 20 列。

点击新增规则，在右侧抽屉填写规则名称、商户名称、商户编号、规则类型、分账渠道、渠道下级、规则状态、生效日期、分账方式和手续费率。以上字段均必填，保存后关闭抽屉并把新记录显示在列表首行。

点击编辑，在右侧抽屉修改以上 10 个字段，保存后关闭抽屉并更新当前记录。

点击任一记录查看详情，在右侧抽屉只读展示完整规则信息，关闭后保留原列表和查询条件。

每条记录提供删除操作，删除前必须二次确认，确认后从列表移除并反馈删除成功。

不需要批量操作，默认每页 20 条。`;
const changeId = `20260803-list-workbench-test-${randomBytes(4).toString('hex')}`;
const changeArg = `changes/${changeId}`;
const changeDir = resolve(root, changeArg);
const basicRequest = '创建老板管账的结算规则查询列表页。查询条件包括创建时间区间、规则名称和规则状态。列表展示规则编号、规则名称、商户名称、规则状态和创建时间。';
const normalizedNaturalRequest = `创建一个页面，老板管账商户查询页面
条件：注册时间、代理名称、部门名称、商户名称、商户编号、业务角色、首笔交易时间
table列表：注册时间、商户编号、商户名称、商户简称、部门名称、直属代理、业务角色`;

try {
  const classified = classifyBossLedgerGeneration(request);
  if (classified.status !== 'fast' || classified.recipe !== 'list-workbench') {
    throw new Error('The unified generation entry did not select the list workbench recipe.');
  }
  const parsed = parseListWorkbenchRequest(request);
  if (parsed.pageName !== '分账规则管理') throw new Error('List page name was not parsed.');
  const bracketed = parseListWorkbenchRequest(request.replace('创建老板管账的分账规则管理列表页', '创建老板管账的【分账规则管理】列表页'));
  if (bracketed.pageName !== '分账规则管理') throw new Error('Decorative page-name brackets were not normalized.');
  if (JSON.stringify(parsed.queryLabels) !== JSON.stringify(['规则名称', '规则编号', '商户编号', '商户名称', '规则状态', '分账渠道', '创建时间', '更新时间', '生效日期', '失效日期'])) {
    throw new Error('Query fields were not parsed from the request.');
  }
  if (parsed.columnLabels.length !== 20 || parsed.columnLabels.at(-1) !== '最后修改人') {
    throw new Error('Table fields were not parsed from the request.');
  }
  if (!parsed.operations.detail || !parsed.operations.create || !parsed.operations.edit || !parsed.operations.delete) {
    throw new Error('The list workbench did not retain all four requested operations.');
  }
  if (parsed.formLabels.length !== 10 || parsed.formLabels.at(-1) !== '手续费率') {
    throw new Error('The list workbench did not expand the edit field reference to the create fields.');
  }
  const basic = parseListWorkbenchRequest(basicRequest);
  if (basic.queryLabels.length !== 3 || basic.columnLabels.length !== 5 || Object.keys(basic.operations).length !== 0) {
    throw new Error('A basic list request using “查询条件包括” was not parsed without optional row operations.');
  }
  const basicClassified = classifyBossLedgerGeneration(basicRequest);
  if (basicClassified.status !== 'fast' || basicClassified.recipe !== 'list-workbench') {
    throw new Error('A basic list request using “查询条件包括” did not select the list workbench recipe.');
  }
  const normalizedNatural = parseListWorkbenchRequest(normalizedNaturalRequest);
  if (normalizedNatural.pageName !== '商户查询' || normalizedNatural.queryLabels.length !== 7 || normalizedNatural.columnLabels.length !== 7) {
    throw new Error('Natural condition and table section headers were not normalized into a list workbench request.');
  }
  const normalizedNaturalClassified = classifyBossLedgerGeneration(normalizedNaturalRequest);
  if (normalizedNaturalClassified.status !== 'fast' || normalizedNaturalClassified.recipe !== 'list-workbench') {
    throw new Error('A normalized natural-language list request did not select the list workbench recipe.');
  }

  const compiled = compileListWorkbench({ rawRequest: request, changeId });
  if (!compiled.content.capabilities.includes('query.advanced') || compiled.content.capabilities.includes('query.basic')) {
    throw new Error('More than six query fields must use advanced query mode.');
  }
  if (compiled.list.query.defaultExpanded !== false || Object.hasOwn(compiled.list.query, 'collapseThreshold') || compiled.list.query.fields.filter((field) => field.advanced).length !== 4) {
    throw new Error('Advanced query fields did not receive declarative primary/secondary grouping.');
  }
  if (!compiled.list.table.drawerDetail || compiled.list.table.primaryAction?.form?.fields.length !== 10) {
    throw new Error('The list workbench did not compile detail and create drawers.');
  }
  const compiledColumns = new Map(compiled.list.table.columns.map((column) => [column.label, column]));
  const formFields = compiled.list.table.primaryAction.form.fields;
  if (formFields.some((field) => compiledColumns.get(field.label)?.key !== field.key)) {
    throw new Error('Create/edit fields do not share stable keys with their table columns.');
  }
  if (compiledColumns.get('费率类型')?.format || compiledColumns.get('手续费率')?.format !== 'amount') {
    throw new Error('Rate type and numeric rate columns were classified incorrectly.');
  }
  if (compiled.list.table.rows.some((row) => Object.values(row).some((value) => String(value).includes('NaN')))) {
    throw new Error('Sample rows contain NaN text instead of typed values.');
  }
  const actions = compiled.list.table.rowActions || [];
  if (!actions.some((action) => action.type === 'edit') || !actions.some((action) => action.type === 'delete')) {
    throw new Error('The list workbench did not compile edit and delete row actions.');
  }
  const deleteAction = actions.find((action) => action.type === 'delete');
  if (deleteAction.confirm?.reversible !== false || !deleteAction.confirm?.successMessage) {
    throw new Error('Delete confirmation is missing irreversible impact or success feedback.');
  }

  const result = spawnSync(process.execPath, [resolve(root, 'scripts/compile-boss-ledger-list-workbench-recipe.mjs'), '--request', request, '--change', changeArg], {
    cwd: root,
    encoding: 'utf8',
    timeout: 30_000
  });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'List workbench compiler failed.');
  if (!existsSync(resolve(changeDir, 'preview.html')) || !existsSync(resolve(changeDir, 'review.md'))) {
    throw new Error('List workbench compiler did not produce preview and review artifacts.');
  }
  const spec = JSON.parse(readFileSync(resolve(changeDir, 'page-spec.json'), 'utf8'));
  if (!spec.content.capabilities.includes('table.deleteAction') || !spec.list.table.rowActions.some((action) => action.type === 'delete')) {
    throw new Error('Generated Page Spec does not expose the delete action.');
  }
  const review = readFileSync(resolve(changeDir, 'review.md'), 'utf8');
  if (!review.includes('静态预检已通过') || review.includes('浏览器自动验收')) {
    throw new Error('List workbench review record crossed the manual-acceptance boundary.');
  }
  console.log('boss-ledger-list-workbench-recipe: pass');
} catch (error) {
  console.error(`boss-ledger-list-workbench-recipe: failed\n- ${error.message}`);
  process.exitCode = 1;
} finally {
  rmSync(changeDir, { recursive: true, force: true });
}
