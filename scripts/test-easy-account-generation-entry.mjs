#!/usr/bin/env node
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { classifyEasyAccountGeneration } from './lib/easy-account-generation-entry.mjs';
import { compileEasyAccountListWorkbench, parseEasyAccountListWorkbenchRequest } from './lib/easy-account-list-workbench-recipe.mjs';
import { normalizeRecipeRequest } from './lib/recipe-request-bridge.mjs';

const root = process.cwd();
const request = '创建易账通的账户查询列表页。支持按账户号码、账户状态查询。列表展示账户号码、账户名称、账户状态和可用余额。点击新增账户，在右侧抽屉填写账户号码、账户名称和账户状态。点击编辑，在右侧抽屉修改账户名称和账户状态。点击任一记录查看详情。每条记录提供删除操作，删除前需要二次确认。默认每页 20 条。';
const flexibleRequest = '我想查易账通账户，按账户号码和账户状态过滤，结果显示账户号码、账户名称、账户状态和可用余额，打开记录明细。';
const structuredStoreRequest = `做一个易账通的查询列表页面，
一级菜单：企业管理，二级菜单：门店管理
查询条件：门店ID、门店名称、门店类型、品牌侧门店编码、所属组织、品牌名称/品牌ID、门店状态
列表可切换：全国门店(109)、直营门店(93)、加盟门店(16)
列表字段：品牌名称/品牌ID、门店ID、门店名称、门店类型、渠道绑定、门店状态、操作（查看、编辑、渠道绑定）
新增门店：
基础信息（门店类型、所属品牌、门店名称、门店ID、品牌侧门店编码、开业时间门店状态）`;
const columnAliasRequest = `做一个易账通角色查询列表页面。
查询条件：角色名称、角色状态。
列字段：角色编号、角色名称、角色状态、创建时间。
新增角色：填写角色名称、角色状态。`;
const complexRoleRequest = `做一个易账通的查询列表页面，
一级菜单：企业管理，二级菜单：角色管理
查询条件：角色名称、角色类型、角色描述、角色状态
列字段：角色名称、角色描述、角色类型、账号数量、角色状态（可启用、禁用，用switch）、创建人、创建时间、操作（查看、编辑）
新建角色：（角色类型（单选）：总部角色、门店角色、供应商角色｜角色名称、角色描述、角色权限（角色树展示））`;
let generatedChangeDir;

try {
  const fast = classifyEasyAccountGeneration(request);
  if (fast.status !== 'fast' || fast.recipe !== 'list-workbench' || fast.route?.intent !== 'query-list') throw new Error('Easy Account list workflow did not select the verified fast recipe.');
  const flexible = classifyEasyAccountGeneration(flexibleRequest);
  if (flexible.status !== 'fast' || flexible.recipe !== 'list-workbench' || flexible.channel !== 'flexible') throw new Error('Flexible Easy Account wording did not use the semantic bridge channel.');
  if (!flexible.inputRequest?.includes('查询') || !flexible.inputRequest?.includes('列表展示')) throw new Error('Flexible Easy Account wording was not normalized into the recipe contract.');
  const structuredStore = classifyEasyAccountGeneration(structuredStoreRequest);
  if (structuredStore.status !== 'fallback' || structuredStore.decision !== 'natural-generation') throw new Error('A store request with a custom action did not continue to natural-language generation.');
  const parsedStore = parseEasyAccountListWorkbenchRequest(structuredStoreRequest);
  if (parsedStore.pageName !== '门店管理' || parsedStore.shell.primaryNav !== '企业管理') throw new Error('Menu labels were not retained for the generated shell.');
  if (parsedStore.queryLabels.length !== 7 || parsedStore.columnLabels.length !== 6) throw new Error('Structured query or table fields crossed a section boundary.');
  if (parsedStore.formLabels.length !== 7 || !parsedStore.operations.create || !parsedStore.operations.detail || !parsedStore.operations.edit) throw new Error('Grouped create fields or requested row actions were not recognized.');
  if (parsedStore.views.length !== 3 || !parsedStore.operations.custom.includes('渠道绑定')) throw new Error('List views or custom row actions were not retained.');
  const normalizedColumnAlias = normalizeRecipeRequest(columnAliasRequest);
  if (normalizedColumnAlias.includes('$1') || !normalizedColumnAlias.includes('；列表字段：角色编号')) throw new Error('Column-field alias normalization did not preserve the section boundary.');
  const parsedColumnAlias = parseEasyAccountListWorkbenchRequest(columnAliasRequest);
  if (parsedColumnAlias.queryLabels.join(',') !== '角色名称,角色状态' || parsedColumnAlias.columnLabels.join(',') !== '角色编号,角色名称,角色状态,创建时间') {
    throw new Error('Column-field alias caused query and table fields to cross a section boundary.');
  }
  if (!parsedColumnAlias.operations.create || parsedColumnAlias.formLabels.join(',') !== '角色名称,角色状态') {
    throw new Error('New-role form fields were not recognized independently from query fields.');
  }
  const complexRole = classifyEasyAccountGeneration(complexRoleRequest);
  if (complexRole.status !== 'fallback' || !complexRole.reason?.includes('角色或权限树')) {
    throw new Error('Unsupported role-tree configuration must not be compiled by the list-workbench recipe.');
  }
  const storeSpec = compileEasyAccountListWorkbench({ rawRequest: structuredStoreRequest, changeId: '20260806-store-parser-check' });
  if (storeSpec.list.table.rows.length !== 2 || storeSpec.list.table.primaryAction?.form.fields.length !== 7) throw new Error('Store preview data or create form was not compiled.');
  if (storeSpec.list.table.views.length !== 3 || storeSpec.list.table.rowActions.map((action) => action.label).join(',') !== '查看详情,编辑,渠道绑定') throw new Error('Store views or row actions were not compiled.');
  const fallback = classifyEasyAccountGeneration('易账通运营人员登记渠道联系人，填写姓名、手机号码和所属渠道后保存。');
  if (fallback.status !== 'clarify' || !fallback.question?.includes('页面类型')) throw new Error('An unmatched Easy Account request did not receive a page-intent clarification.');
  const missingFields = classifyEasyAccountGeneration('创建易账通账户查询列表。');
  if (missingFields.status !== 'clarify' || !missingFields.question?.includes('查询条件') || !missingFields.question?.includes('列表')) throw new Error('Missing Easy Account list fields did not produce a targeted clarification.');
  const missingService = classifyEasyAccountGeneration('做一个查询列表页面。');
  if (missingService.status !== 'clarify' || !missingService.question?.includes('所属服务')) throw new Error('Missing service ownership did not produce a service clarification.');
  const naturalGeneration = classifyEasyAccountGeneration('做一个易账通新增账户表单，字段包括账户名称、账户类型和开户日期。');
  if (naturalGeneration.status !== 'fallback' || naturalGeneration.decision !== 'natural-generation' || naturalGeneration.stage !== 'recipe') throw new Error('A clear non-recipe request did not continue to controlled natural-language generation.');
  const blocked = classifyEasyAccountGeneration('做一个易账通业务概览 Dashboard。');
  if (blocked.status !== 'blocked' || blocked.decision !== 'blocked' || blocked.stage !== 'capability') throw new Error('An unavailable Easy Account capability was not distinguished from a recipe miss.');
  const result = spawnSync(process.execPath, [resolve(root, 'scripts/generate-easy-account-page.mjs'), '--request', request, '--json'], { cwd: root, encoding: 'utf8', timeout: 30_000 });
  if (result.error?.code === 'ETIMEDOUT' || result.status !== 0) throw new Error(result.stderr || result.stdout || 'Generation entry failed.');
  const delivered = JSON.parse(result.stdout);
  if (delivered.status !== 'generated' || delivered.recipe !== 'list-workbench') throw new Error('Generation entry did not report the recipe-generated delivery.');
  if (!/^changes\/\d{8}-[a-z0-9-]+$/.test(delivered.change)) throw new Error(`Generation entry allocated an invalid Change id: ${delivered.change}`);
  generatedChangeDir = resolve(root, delivered.change);
  if (!existsSync(resolve(generatedChangeDir, 'preview.html')) || !existsSync(resolve(generatedChangeDir, 'review.md'))) throw new Error('Generation entry did not produce the preview and human review record.');
  const review = readFileSync(resolve(generatedChangeDir, 'review.md'), 'utf8');
  if (!review.includes('静态预检已通过') || review.includes('浏览器自动验收')) throw new Error('Generation entry did not preserve the manual-acceptance boundary.');
  console.log('easy-account-generation-entry: pass');
} catch (error) {
  console.error(`easy-account-generation-entry: failed\n- ${error.message}`);
  process.exitCode = 1;
} finally {
  if (generatedChangeDir) rmSync(generatedChangeDir, { recursive: true, force: true });
}
