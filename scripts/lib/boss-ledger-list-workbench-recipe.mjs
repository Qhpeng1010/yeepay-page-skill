const RULE_REFS = ['BL-TPL-001', 'BL-TPL-012', 'BL-TPL-013', 'BL-INT-002', 'BL-INT-004', 'BL-INT-010'];
const STATUS_OPTIONS = [
  { label: '生效中', value: 'active' },
  { label: '待生效', value: 'pending' },
  { label: '已失效', value: 'disabled' }
];
const STATUS_MAP = {
  active: { label: '生效中', status: 'success' },
  pending: { label: '待生效', status: 'processing' },
  disabled: { label: '已失效', status: 'default' },
  deleted: { label: '已删除', status: 'default' }
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
        && !/^以上\d+(?:个字段|个项)$/.test(compact);
    });
}

function sectionValue(request, headerPattern, nextHeaderPattern) {
  const header = request.match(headerPattern);
  if (!header || header.index === undefined) return '';
  const remainder = request.slice(header.index + header[0].length);
  const punctuationIndex = remainder.search(/[。；]/);
  const nextHeaderIndex = nextHeaderPattern ? remainder.search(nextHeaderPattern) : -1;
  const endIndex = [punctuationIndex, nextHeaderIndex].filter((index) => index >= 0).sort((left, right) => left - right)[0];
  return remainder.slice(0, endIndex === undefined ? undefined : endIndex).trim();
}

function fieldKey(label, index = 0) {
  const known = {
    规则编号: 'ruleNo', 规则名称: 'ruleName', 商户编号: 'merchantNo', 商户名称: 'merchantName',
    商户简称: 'merchantShortName', 规则状态: 'status', 状态: 'status', 创建时间: 'createdAt',
    更新时间: 'updatedAt', 生效日期: 'effectiveAt', 失效日期: 'expiresAt', 金额: 'amount', 手续费: 'fee',
    服务费率: 'serviceFeeRate', 手续费率: 'feeRate', 费率类型: 'feeType', 所属行业: 'industry',
    规则类型: 'ruleType', 分账渠道: 'splitChannel', 渠道下级: 'channelSubordinate', 分账方式: 'splitMethod',
    分账周期: 'splitCycle', 待分账金额: 'pendingAmount', 预计到账金额: 'expectedIncome', 预计扣账金额: 'expectedDeduction',
    创建人: 'createdBy', 最后修改人: 'updatedBy', 审核状态: 'reviewStatus', 配置状态: 'configStatus'
  };
  if (known[label]) return known[label];
  const hash = [...String(label)].reduce((value, character) => ((value * 31) + character.codePointAt(0)) >>> 0, 7);
  return `field${hash.toString(36) || index + 1}`;
}

function controlFor(label) {
  if (/状态/.test(label)) return { control: 'select', options: STATUS_OPTIONS };
  if (/日期|时间/.test(label)) return { control: 'date' };
  if (/类型|渠道|方式|角色/.test(label)) return { control: 'select', options: [{ label: '线上收单', value: 'online' }, { label: '联营渠道', value: 'partner' }] };
  if (/金额|手续费|服务费率|费率(?!类型)|比例|数量/.test(label)) return { control: 'number' };
  return { control: 'input' };
}

function columnFor(label, index) {
  const key = fieldKey(label, index);
  const column = { key, label, width: /名称|简称/.test(label) ? 200 : 140 };
  if (/状态/.test(label)) Object.assign(column, { format: 'status', statusMap: STATUS_MAP });
  if (/金额|手续费|服务费率|费率(?!类型)|比例|数量/.test(label)) Object.assign(column, { format: 'amount', unit: /费率|比例/.test(label) ? '%' : '元' });
  if (/编号/.test(label)) column.width = 140;
  return column;
}

function fieldFor(label, index, required = true) {
  return { key: fieldKey(label, index), label, required, ...controlFor(label) };
}

function sampleValue(column, rowIndex) {
  const values = {
    规则编号: ['R001', 'R002'], 规则名称: ['华东直营网点结算', '联营渠道月度分润'], 商户编号: ['10080048989', '10080048990'],
    商户名称: ['杭州星云商贸有限公司', '上海锦程科技有限公司'], 商户简称: ['杭州星云', '上海锦程'], 所属行业: ['零售', '科技服务'],
    费率类型: ['按比例', '按固定金额'], 规则状态: ['active', 'pending'], 配置状态: ['active', 'pending'], 审核状态: ['pending', 'active'],
    创建时间: ['2026-07-16 11:35:22', '2026-07-15 16:20:10'], 更新时间: ['2026-07-16 11:40:10', '2026-07-15 16:25:30'],
    生效日期: ['2026-07-16', '2026-07-15'], 失效日期: ['2027-07-16', '2027-07-15'], 服务费率: [0.38, 0.2], 手续费率: [0.12, 0.08],
    手续费: [120, 80], 金额: [12860.32, 9820], 待分账金额: [12860.32, 9820], 预计到账金额: [12600, 9600], 预计扣账金额: [260.32, 220],
    费率: [0.38, 0.2], 分账比例: [30, 25]
  };
  const value = values[column.label]?.[rowIndex];
  if (value !== undefined) return value;
  if (column.format === 'amount') return 0;
  return `${column.label}示例${rowIndex + 1}`;
}

function extractPageName(request) {
  const match = request.match(/创建老板管账的([^。；]+?)(?:列表页|列表页面|列表|页面)/)
    || request.match(/老板管账(?:的)?([^。；]+?)(?:列表页|列表页面|页面)/);
  return match ? match[1].trim().replace(/^【(.+)】$/, '$1') : '记录查询';
}

function extractFormLabels(request, action) {
  const expression = action === 'edit'
    ? /编辑[\s\S]*?(?:修改|填写)([^。；]*?)(?=(?:保存|提交|确认|关闭)|[。；]|$)/
    : /新增[\s\S]*?(?:填写|输入)([^。；]*?)(?=(?:保存|提交|确认|关闭)|[。；]|$)/;
  const match = request.match(expression);
  return match ? fieldsFrom(match[1]) : [];
}

export function parseListWorkbenchRequest(rawRequest) {
  const request = normalize(rawRequest);
  if (!request) throw new Error('缺少业务需求。');
  const tableHeaderPattern = /(?:\btable\s*)?列表\s*(?:展示|显示|包括|为|有|字段|列|：|:)|(?:结果|表格)(?:列表|字段|列)\s*(?:展示|显示|包括|为|有|：|:)/i;
  const querySection = sectionValue(
    request,
    /(?:查询|筛选)?(?:条件|筛选项|查询项)\s*(?:包括|为|有|：|:)\s*/,
    tableHeaderPattern
  );
  const columnSection = sectionValue(request, tableHeaderPattern);
  const queryMatch = request.match(/(?:支持|可以|可)?(?:按|根据)([^。；]+?)(?:查询|筛选)/)
    || request.match(/(?:查询|筛选)条件(?:包括|为|有|：|:)\s*([^。；]+)/)
    || request.match(/(?:查询|筛选)字段(?:包括|为|有|：|:)\s*([^。；]+)/);
  const columnMatch = request.match(/列表(?:展示|显示)([^。；]+)/);
  const queryLabels = queryMatch ? fieldsFrom(queryMatch[1]) : fieldsFrom(querySection);
  const columnLabels = columnMatch ? fieldsFrom(columnMatch[1]) : fieldsFrom(columnSection);
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
  const fallbackEditable = columns.filter((column) => !/编号|创建时间|更新时间/.test(column.label)).map((column) => column.label);
  const formLabels = editableLabels.length ? editableLabels : fallbackEditable;
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

function formSpec(parsed, kind) {
  const titlePrefix = kind === 'edit' ? '编辑' : '新增';
  return {
    title: `${titlePrefix}${parsed.pageName}`,
    primaryLabel: '保存',
    successMessage: `${parsed.pageName}${kind === 'edit' ? '已更新' : '已新增'}。`,
    fields: parsed.formLabels.map((label, index) => fieldFor(label, index))
  };
}

export function compileListWorkbench({ rawRequest, changeId }) {
  const parsed = parseListWorkbenchRequest(rawRequest);
  const isAdvancedQuery = parsed.queryLabels.length > 6;
  const query = parsed.queryLabels.map((label, index) => ({
    ...fieldFor(label, index, false),
    ...(isAdvancedQuery && index >= 6 ? { advanced: true } : {})
  }));
  const columns = parsed.columns || parsed.columnLabels.map((label, index) => columnFor(label, index));
  const rowKey = columns.find((column) => /编号/.test(column.label))?.key || columns[0].key;
  const rows = [0, 1].map((rowIndex) => Object.fromEntries(columns.map((column) => [column.key, sampleValue(column, rowIndex)])));
  const capabilities = [isAdvancedQuery ? 'query.advanced' : 'query.basic', 'table.flat', 'table.pagination'];
  if (columns.some((column) => column.format === 'status')) capabilities.push('table.status');
  if (columns.some((column) => column.format === 'amount')) capabilities.push('table.amount');
  if (parsed.operations.detail) capabilities.push('detail.drawer');
  if (parsed.operations.create) capabilities.push('list.drawerCreate');
  if (parsed.operations.edit) capabilities.push('table.editAction');
  if (parsed.operations.delete) capabilities.push('table.confirmAction', 'table.deleteAction');

  const table = { rowKey, sectionTitle: `${parsed.pageName}列表`, columns, rows, pagination: { page: 1, pageSize: 20, total: rows.length } };
  if (parsed.operations.create) {
    table.primaryAction = { key: 'create', label: '新增', createRecord: { [rowKey]: 'R003' }, form: formSpec(parsed, 'create') };
  }
  const actions = [];
  if (parsed.operations.detail) actions.push({ key: 'detail', label: '详情', type: 'detail' });
  if (parsed.operations.edit) actions.push({ key: 'edit', label: '编辑', type: 'edit', form: formSpec(parsed, 'edit') });
  if (parsed.operations.delete) actions.push({
    key: 'delete', label: '删除', type: 'delete', danger: true,
    confirm: { title: `确认删除${parsed.pageName}`, description: '确认删除当前记录吗？', impact: '删除后该记录将从当前列表移除。', reversible: false, successMessage: '记录已删除。' }
  });
  if (actions.length) {
    table.columns = [...columns, { key: 'actions', label: '操作', width: 180, hideable: false }];
    table.rowActions = actions;
  }
  if (parsed.operations.detail) {
    table.drawerDetail = {
      title: `${parsed.pageName}详情`, closeLabel: '关闭',
      groups: [{ key: 'basic', title: '基本信息', fields: columns.map((column) => ({ key: column.key, label: column.label, source: column.key, ...(column.format === 'status' ? { format: 'status', statusMap: STATUS_MAP } : {}), ...(column.format === 'amount' ? { format: 'amount', unit: column.unit } : {}) })) }]
    };
  }

  return {
    schemaVersion: 1,
    ui: { system: 'boss-ledger', runtime: 'react-antd-page-spec', rendererVersion: 1 },
    metadata: {
      changeId, pageName: parsed.pageName, family: 'list', templateId: 'list.regular', executionMode: 'page-spec-default', request: parsed.request,
      selectionReason: '主要任务是查询和处理一组记录；详情、新增、编辑和删除按业务需求组合到同一列表工作台。',
      assumptions: ['当前为客户端交互原型，不调用真实业务服务。', '未提供样例数据时使用两条通用演示记录。', '删除为当前列表中的客户端移除，并提供不可撤销确认。'],
      ruleRefs: RULE_REFS
    },
    shell: { activePrimaryKey: 'workspace' },
    content: { capabilities: [...new Set(capabilities)] },
    list: { query: { fields: query, ...(isAdvancedQuery ? { defaultExpanded: false } : {}) }, table }
  };
}
