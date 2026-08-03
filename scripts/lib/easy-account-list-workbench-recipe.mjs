const RULE_REFS = ['EA-TPL-001', 'EA-TPL-003', 'EA-TPL-004', 'EA-TPL-005', 'EA-TPL-017', 'EA-INT-002', 'EA-INT-004', 'EA-INT-005', 'EA-INT-014'];

const STATUS_OPTIONS = [
  { label: '正常', value: '正常' },
  { label: '待核验', value: '待核验' },
  { label: '已冻结', value: '已冻结' },
  { label: '已关闭', value: '已关闭' }
];

const STATUS_MAP = {
  正常: { text: '正常', tone: 'success' },
  待核验: { text: '待核验', tone: 'warning' },
  已冻结: { text: '已冻结', tone: 'error' },
  已关闭: { text: '已关闭', tone: 'default' },
  生效中: { text: '生效中', tone: 'success' },
  待生效: { text: '待生效', tone: 'warning' },
  已失效: { text: '已失效', tone: 'default' }
};

function normalize(value) {
  return String(value || '').replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
}

function fieldsFrom(value) {
  return normalize(value)
    .replace(/[。；;]+$/g, '')
    .split(/[、，,；;]|和/)
    .map((field) => field.replace(/^(?:按|根据|填写|输入|修改|展示|显示|包括)/, '').trim())
    .filter((field) => field && !/^(?:保存|提交|关闭|确认|并|后)/.test(field))
    .filter((field) => {
      const compact = field.replace(/\s+/g, '');
      return !/^共\d+(?:个查询条件|列|个字段|个项)$/.test(compact)
        && !/^以上\d+(?:个字段|个项)$/.test(compact)
        && !/^(?:以上|上述|前述)(?:字段|信息|内容)?(?:均)?(?:为)?必填$/.test(compact);
    });
}

function fieldKey(label, index = 0) {
  const known = {
    账户号: 'accountNo', 账户号码: 'accountNo', 账户名称: 'accountName', 账户状态: 'accountStatus',
    商户编号: 'merchantNo', 商户名称: 'merchantName', 商户简称: 'merchantShortName', 账户类型: 'accountType',
    规则编号: 'ruleNo', 规则名称: 'ruleName', 规则状态: 'status', 状态: 'status', 创建时间: 'createdAt',
    更新时间: 'updatedAt', 开户时间: 'openedAt', 生效日期: 'effectiveAt', 失效日期: 'expiresAt',
    可用余额: 'availableBalance', 账户余额: 'accountBalance', 冻结金额: 'frozenAmount', 金额: 'amount',
    手续费: 'fee', 服务费: 'serviceFee', 手续费率: 'feeRate', 服务费率: 'serviceFeeRate',
    费率类型: 'feeType', 规则类型: 'ruleType', 结算方式: 'settlementMethod', 结算周期: 'settlementCycle',
    所属行业: 'industry', 创建人: 'createdBy', 最后修改人: 'updatedBy', 审核状态: 'reviewStatus', 配置状态: 'configStatus'
  };
  if (known[label]) return known[label];
  const hash = [...String(label)].reduce((value, character) => ((value * 31) + character.codePointAt(0)) >>> 0, 7);
  return `field${hash.toString(36) || index + 1}`;
}

function controlFor(label) {
  if (/状态/.test(label)) return { control: 'select', options: STATUS_OPTIONS };
  if (/日期|时间/.test(label)) return { control: 'date' };
  if (/类型|渠道|方式|角色|行业|周期/.test(label)) {
    return { control: 'select', options: [{ label: '基础账户', value: 'basic' }, { label: '专用账户', value: 'special' }] };
  }
  if (/金额|余额|手续费|费用|费率|比例|数量/.test(label)) return { control: 'number', precision: /费率|比例/.test(label) ? 2 : 2 };
  return { control: 'input' };
}

function isCurrency(label) {
  return /金额|余额|手续费(?!率)|费用(?!率)/.test(label);
}

function isRate(label) {
  return /费率|比例/.test(label);
}

function columnFor(label, index) {
  const key = fieldKey(label, index);
  const column = { key, label, width: /名称|简称/.test(label) ? 200 : 140 };
  if (/状态/.test(label)) Object.assign(column, { format: 'status' });
  if (isCurrency(label)) Object.assign(column, { format: 'amount', currency: 'CNY', width: 150 });
  if (/编号|账户号/.test(label)) column.width = 160;
  return column;
}

function fieldFor(label, index, required = true) {
  return { key: fieldKey(label, index), label, required, ...controlFor(label) };
}

function currency(minor) {
  return { minor: String(minor), currency: 'CNY' };
}

function sampleValue(column, rowIndex) {
  const values = {
    账户号: ['EA10080028701', 'EA10080028702', 'EA10080028703'],
    账户号码: ['EA10080028701', 'EA10080028702', 'EA10080028703'],
    账户名称: ['杭州星云结算账户', '上海锦程结算账户', '广州启明结算账户'],
    商户编号: ['M10080028707', 'M10080028708', 'M10080028709'],
    商户名称: ['杭州星云商贸有限公司', '上海锦程科技有限公司', '广州启明商贸有限公司'],
    商户简称: ['杭州星云', '上海锦程', '广州启明'],
    账户类型: ['基础账户', '专用账户', '基础账户'],
    账户状态: [STATUS_MAP.正常, STATUS_MAP.待核验, STATUS_MAP.已冻结],
    规则状态: [STATUS_MAP.生效中, STATUS_MAP.待生效, STATUS_MAP.已失效],
    状态: [STATUS_MAP.正常, STATUS_MAP.待核验, STATUS_MAP.已冻结],
    创建时间: ['2026-08-03 10:20:12', '2026-08-02 16:35:28', '2026-08-01 09:18:43'],
    更新时间: ['2026-08-03 11:05:10', '2026-08-02 17:10:30', '2026-08-01 10:25:15'],
    开户时间: ['2025-01-15', '2025-03-22', '2024-11-09'],
    生效日期: ['2026-08-03', '2026-08-02', '2026-08-01'],
    失效日期: ['2027-08-03', '2027-08-02', '2027-08-01'],
    可用余额: [currency('26540000'), currency('9850000'), currency('0')],
    账户余额: [currency('28654000'), currency('9850000'), currency('2114000')],
    冻结金额: [currency('0'), currency('0'), currency('2114000')],
    金额: [currency('1286032'), currency('982000'), currency('761050')],
    手续费: [currency('12000'), currency('8000'), currency('6600')],
    服务费: [currency('4880'), currency('3120'), currency('2600')],
    手续费率: ['0.38%', '0.20%', '0.12%'],
    服务费率: ['0.38%', '0.20%', '0.12%'],
    费率类型: ['按比例', '按固定金额', '按比例']
  };
  const value = values[column.label]?.[rowIndex];
  if (value !== undefined) return value;
  if (column.format === 'status') return STATUS_MAP.正常;
  if (column.format === 'amount') return currency('0');
  if (isRate(column.label)) return '0.00%';
  return `${column.label}示例${rowIndex + 1}`;
}

function extractPageName(request) {
  const match = request.match(/创建(?:易账通|Easy\s*Account)?的?([^。；]+?)(?:列表页|列表页面|列表|页面)/i);
  return match ? match[1].trim().replace(/^【(.+)】$/, '$1') : '账户记录';
}

function extractFormLabels(request, action) {
  const expression = action === 'edit'
    ? /编辑[\s\S]*?(?:修改|填写)([^。；]*?)(?=(?:保存|提交|确认|关闭)|[。；]|$)/
    : /新增[\s\S]*?(?:填写|输入)([^。；]*?)(?=(?:保存|提交|确认|关闭)|[。；]|$)/;
  const match = request.match(expression);
  return match ? fieldsFrom(match[1]) : [];
}

export function parseEasyAccountListWorkbenchRequest(rawRequest) {
  const request = normalize(rawRequest);
  if (!request) throw new Error('缺少业务需求。');
  const queryMatch = request.match(/(?:支持|可以|可)?(?:按|根据)([^。；]+?)(?:查询|筛选)/);
  const columnMatch = request.match(/列表(?:展示|显示)([^。；]+)/);
  const queryLabels = queryMatch ? fieldsFrom(queryMatch[1]) : [];
  const columnLabels = columnMatch ? fieldsFrom(columnMatch[1]) : [];
  if (!queryLabels.length || !columnLabels.length) throw new Error('列表配方需要明确的查询条件和列表字段。');

  const hasDetail = /查看详情|查看.*详情|详情抽屉|只读展示.*详情|点击任一.*详情/.test(request);
  const hasCreate = /新增/.test(request);
  const hasEdit = /编辑|修改/.test(request);
  const hasDelete = /删除/.test(request);
  if (!hasDetail && !hasCreate && !hasEdit && !hasDelete) {
    return { request, pageName: extractPageName(request), queryLabels, columnLabels, operations: {} };
  }

  const columns = columnLabels.map((label, index) => columnFor(label, index));
  const editableLabels = [...new Set([
    ...(hasCreate ? extractFormLabels(request, 'create') : []),
    ...(hasEdit ? extractFormLabels(request, 'edit') : [])
  ])];
  const fallbackEditable = columns.filter((column) => !/编号|账户号|创建时间|更新时间/.test(column.label)).map((column) => column.label);
  const formLabels = editableLabels.length ? editableLabels : fallbackEditable;
  if ((hasCreate || hasEdit) && formLabels.length > 10) {
    throw new Error('列表内抽屉新增或编辑最多支持 10 个字段；请使用整页表单。');
  }
  return {
    request,
    pageName: extractPageName(request),
    queryLabels,
    columnLabels,
    operations: { detail: hasDetail, create: hasCreate, edit: hasEdit, delete: hasDelete },
    columns,
    formLabels
  };
}

function formSpec(parsed, kind, rowKey, nextKeyValue) {
  const titlePrefix = kind === 'edit' ? '编辑' : '新增';
  return {
    title: `${titlePrefix}${parsed.pageName}`,
    ...(kind === 'create' ? { recordDefaults: { [rowKey]: nextKeyValue } } : {}),
    fields: parsed.formLabels.map((label, index) => fieldFor(label, index)),
    submit: {
      primaryLabel: kind === 'edit' ? '保存修改' : '保存',
      secondaryLabel: '取消',
      successMessage: `${parsed.pageName}${kind === 'edit' ? '修改成功' : '新增成功'}`
    }
  };
}

export function compileEasyAccountListWorkbench({ rawRequest, changeId }) {
  const parsed = parseEasyAccountListWorkbenchRequest(rawRequest);
  const isAdvancedQuery = parsed.queryLabels.length > 6;
  const query = parsed.queryLabels.map((label, index) => ({
    ...fieldFor(label, index, false),
    ...(isAdvancedQuery && index >= 6 ? { advanced: true } : {})
  }));
  const columns = parsed.columns || parsed.columnLabels.map((label, index) => columnFor(label, index));
  const rowKey = columns.find((column) => /编号|账户号/.test(column.label))?.key || columns[0].key;
  const rows = [0, 1].map((rowIndex) => Object.fromEntries(columns.map((column) => [column.key, sampleValue(column, rowIndex)])));
  const capabilities = [isAdvancedQuery ? 'query.advanced' : 'query.basic', 'table.flat', 'table.pagination', 'table.columnSettings'];
  if (columns.some((column) => column.format === 'status')) capabilities.push('table.status');
  if (columns.some((column) => column.format === 'amount')) capabilities.push('table.amount');
  if (parsed.operations.detail) capabilities.push('detail.drawer');
  if (parsed.operations.create) capabilities.push('list.drawerCreate');
  if (parsed.operations.edit) capabilities.push('table.editAction');
  if (parsed.operations.delete) capabilities.push('table.confirmAction', 'table.deleteAction');

  const nextKeyValue = sampleValue(columns.find((column) => column.key === rowKey) || columns[0], 2);
  const table = {
    rowKey,
    sectionTitle: `${parsed.pageName}列表`,
    columns,
    rows,
    scrollX: Math.max(1080, columns.reduce((total, column) => total + (column.width || 140), 0) + (parsed.operations.detail || parsed.operations.edit || parsed.operations.delete ? 210 : 0)),
    pagination: { page: 1, pageSize: 20, total: rows.length },
    tools: ['settings']
  };
  if (parsed.operations.create) {
    table.primaryAction = {
      key: 'create',
      label: `新增${parsed.pageName}`,
      presentation: 'drawer',
      form: formSpec(parsed, 'create', rowKey, nextKeyValue)
    };
  }
  const actions = [];
  if (parsed.operations.detail) actions.push({ key: 'detail', label: '查看详情', type: 'detail' });
  if (parsed.operations.edit) actions.push({ key: 'edit', label: '编辑', type: 'edit', form: formSpec(parsed, 'edit', rowKey, nextKeyValue) });
  if (parsed.operations.delete) actions.push({
    key: 'delete',
    label: '删除',
    type: 'delete',
    danger: true,
    confirm: {
      title: `确认删除${parsed.pageName}？`,
      description: '确认删除当前记录吗？',
      impact: '删除后该记录将从当前列表移除，且不可恢复。',
      reversible: false,
      successMessage: '记录已删除。'
    }
  });
  if (actions.length) {
    table.columns = [...columns, { key: 'actions', label: '操作', width: 210, hideable: false }];
    table.rowActions = actions;
  }
  if (parsed.operations.detail) {
    table.drawerDetail = {
      title: `${parsed.pageName}详情`,
      closeLabel: '关闭',
      groups: [{
        key: 'basic',
        title: '基本信息',
        fields: columns.map((column) => ({
          key: column.key,
          label: column.label,
          source: column.key,
          ...(column.format === 'status' ? { format: 'status' } : {}),
          ...(column.format === 'amount' ? { format: 'amount', currency: 'CNY' } : {})
        }))
      }]
    };
  }

  return {
    schemaVersion: 1,
    metadata: {
      changeId,
      pageName: parsed.pageName,
      family: 'list',
      templateId: 'list.account-query',
      request: parsed.request,
      selectionReason: '主要任务是查询和处理一组账户或账务记录；详情、新增、编辑和删除按业务需求组合到同一列表工作台。',
      assumptions: ['当前为客户端交互原型，不调用真实账户或账务服务。', '未提供样例数据时使用两条通用演示记录。', '删除为当前列表中的客户端移除，并提供不可恢复确认。'],
      ruleRefs: RULE_REFS
    },
    ui: { system: 'easy-account', runtime: 'easy-account-page-spec', rendererVersion: 1 },
    shell: { primaryNav: '账户管理', sideNav: '账户查询' },
    content: { capabilities: [...new Set(capabilities)] },
    list: { query: { fields: query, ...(isAdvancedQuery ? { collapseThreshold: 6 } : {}) }, table },
    states: { loading: true, empty: true, error: true, permissionDenied: true }
  };
}
