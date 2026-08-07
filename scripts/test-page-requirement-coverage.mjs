#!/usr/bin/env node
import { compileStructuredWizard } from './lib/boss-ledger-wizard-recipe.mjs';
import { compileEasyAccountListWorkbench } from './lib/easy-account-list-workbench-recipe.mjs';
import { analyzeRequirementCoverage } from './lib/page-requirement-coverage.mjs';
import { resolveResources } from './resolve-resources.mjs';

const storeRequest = `做一个易账通的查询列表页面，
一级菜单：企业管理，二级菜单：门店管理
查询条件：门店ID、门店名称、门店类型、品牌侧门店编码、所属组织、品牌名称/品牌ID、门店状态
列表可切换：全国门店(109)、直营门店(93)、加盟门店(16)
列表字段：品牌名称/品牌ID、门店ID、门店名称、门店类型、渠道绑定、门店状态、操作（查看、编辑、渠道绑定）
新增门店：
基础信息（门店类型、所属品牌、门店名称、门店ID、品牌侧门店编码、开业时间门店状态）`;

const wizardRequest = '做一个老板管账的新增分账规则页面。第一步：规则名称、规则类型、生效日期。第二步：分账方、手续费。第三步：预览页面。';

try {
  const storeSpec = compileEasyAccountListWorkbench({ rawRequest: storeRequest, changeId: '20260806-store-coverage-test' });
  const completeStore = analyzeRequirementCoverage(storeSpec);
  if (completeStore.errors.length) throw new Error(`Complete store page failed coverage: ${completeStore.errors.join('; ')}`);

  const incompleteStore = structuredClone(storeSpec);
  incompleteStore.list.table.rows = [];
  delete incompleteStore.list.table.primaryAction;
  incompleteStore.list.table.rowActions = incompleteStore.list.table.rowActions.filter((action) => action.label !== '渠道绑定');
  const incompleteErrors = analyzeRequirementCoverage(incompleteStore).errors.join('\n');
  for (const expected of ['渠道绑定', '新增字段未覆盖', '新增入口未覆盖', '示例数据']) {
    if (!incompleteErrors.includes(expected)) throw new Error(`Incomplete store page did not report: ${expected}`);
  }

  const wizardSpec = compileStructuredWizard({ rawRequest: wizardRequest, changeId: '20260806-wizard-coverage-test' });
  const completeWizard = analyzeRequirementCoverage(wizardSpec);
  if (completeWizard.errors.length) throw new Error(`Complete wizard failed coverage: ${completeWizard.errors.join('; ')}`);

  const easyRoute = resolveResources('做一个易账通新增账户表单，字段包括账户名称和账户类型。', 'generate');
  const bossRoute = resolveResources('做一个老板管账渠道联系人独立表单，填写姓名和手机号。', 'generate');
  if (!easyRoute.commands?.coverage?.includes('--system easy-account') || !bossRoute.commands?.coverage?.includes('--system boss-ledger')) {
    throw new Error('Natural-language generation routes did not expose the requirement coverage gate.');
  }

  console.log('page-requirement-coverage: pass');
} catch (error) {
  console.error(`page-requirement-coverage: failed\n- ${error.message}`);
  process.exit(1);
}
