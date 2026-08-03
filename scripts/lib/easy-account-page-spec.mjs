import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';

export const ROOT = resolve(new URL('../..', import.meta.url).pathname);
export const EXECUTION_ROOT = resolve(ROOT, 'modules/easy-account/execution');

export function readJson(file) { return JSON.parse(readFileSync(file, 'utf8')); }
export function loadPolicy(root = ROOT) { return readJson(resolve(root, 'modules/easy-account/execution/generation-policy.json')); }
export function pageSpecHash(spec) { return createHash('sha256').update(`${JSON.stringify(spec, null, 2)}\n`).digest('hex'); }

function issue(errors, condition, message) { if (!condition) errors.push(message); }
function text(value) { return typeof value === 'string' && value.trim().length > 0; }
function unique(values) { return new Set(values).size === values.length; }

function knownRuleIds(root) {
  const dir = resolve(root, 'modules/easy-account/director-rules');
  const source = ['01-visual-constitution.md', '02-template-application-rules.md', '03-interaction-acceptance-rules.md']
    .map((file) => readFileSync(resolve(dir, file), 'utf8')).join('\n');
  return new Set(source.match(/EA-(?:VIS|TPL|INT)-\d{3}/g) || []);
}

function validateField(errors, field, location) {
  issue(errors, field && typeof field === 'object' && !Array.isArray(field), `${location} must be an object.`);
  if (!field || typeof field !== 'object') return;
  issue(errors, text(field.key), `${location}.key is required.`);
  issue(errors, text(field.label), `${location}.label is required.`);
  issue(errors, ['input', 'textarea', 'select', 'radio', 'upload', 'number', 'date', 'date-range'].includes(field.control), `${location}.control is unsupported.`);
  if (['select', 'radio'].includes(field.control)) issue(errors, Array.isArray(field.options) && field.options.length > 0, `${location}.options are required for ${field.control}.`);
  (field.options || []).forEach((option, index) => {
    issue(errors, text(option?.label), `${location}.options[${index}].label is required.`);
    issue(errors, option && Object.hasOwn(option, 'value'), `${location}.options[${index}].value is required.`);
  });
}

function validateList(errors, spec, capabilities) {
  const list = spec.list;
  issue(errors, list && typeof list === 'object', 'list is required for family=list.');
  if (!list) return;
  const fields = list.query?.fields;
  issue(errors, Array.isArray(fields) && fields.length > 0, 'list.query.fields must be a non-empty array.');
  (fields || []).forEach((field, index) => validateField(errors, field, `list.query.fields[${index}]`));
  const hasBasic = capabilities.includes('query.basic');
  const hasAdvanced = capabilities.includes('query.advanced');
  issue(errors, Number(hasBasic) + Number(hasAdvanced) === 1, 'List requires exactly one query mode.');
  if (hasBasic) issue(errors, (fields || []).length <= 6, 'query.basic supports at most 6 fields.');
  const viewQueryFields = (list.table?.views || []).filter((view) => view.queryFields !== undefined);
  if (viewQueryFields.length) issue(errors, capabilities.includes('query.viewFields'), 'View-specific query fields require query.viewFields.');
  viewQueryFields.forEach((view, viewIndex) => {
    issue(errors, Array.isArray(view.queryFields) && view.queryFields.length > 0, `list.table.views[${viewIndex}].queryFields must be a non-empty array.`);
    (view.queryFields || []).forEach((field, fieldIndex) => validateField(errors, field, `list.table.views[${viewIndex}].queryFields[${fieldIndex}]`));
    issue(errors, unique((view.queryFields || []).map((field) => field.key)), `list.table.views[${viewIndex}].queryFields keys must be unique.`);
  });
  const table = list.table;
  issue(errors, table && typeof table === 'object', 'list.table is required.');
  if (!table) return;
  issue(errors, text(table.rowKey), 'list.table.rowKey is required.');
  issue(errors, Array.isArray(table.columns) && table.columns.length > 0, 'list.table.columns are required.');
  issue(errors, Array.isArray(table.rows), 'list.table.rows must be an array.');
  issue(errors, table.pagination && Number.isInteger(table.pagination.pageSize), 'list.table.pagination.pageSize is required.');
  issue(errors, capabilities.includes('table.flat'), 'List requires table.flat.');
  issue(errors, capabilities.includes('table.pagination'), 'List requires table.pagination.');
  const columns = table.columns || [];
  issue(errors, unique(columns.map((column) => column.key)), 'list.table column keys must be unique.');
  columns.forEach((column, index) => {
    issue(errors, text(column.key), `list.table.columns[${index}].key is required.`);
    issue(errors, text(column.label), `list.table.columns[${index}].label is required.`);
    if (column.format === 'status') issue(errors, capabilities.includes('table.status'), 'Status columns require table.status.');
    if (column.format === 'amount') issue(errors, capabilities.includes('table.amount'), 'Amount columns require table.amount.');
    if (column.format === 'stack') {
      issue(errors, capabilities.includes('table.stackCells'), 'Stacked columns require table.stackCells.');
      issue(errors, Array.isArray(column.lines) && column.lines.length > 1, `list.table.columns[${index}].lines must include at least two fields.`);
      (column.lines || []).forEach((line, lineIndex) => issue(errors, text(line?.source), `list.table.columns[${index}].lines[${lineIndex}].source is required.`));
    }
    if (column.actions) issue(errors, Array.isArray(column.actions), `list.table.columns[${index}].actions must be an array.`);
    (column.actions || []).forEach((action, actionIndex) => {
      const location = `list.table.columns[${index}].actions[${actionIndex}]`;
      issue(errors, text(action.key) && text(action.label), `${location} requires key and label.`);
      if (action.type === 'page-form') {
        issue(errors, capabilities.includes('list.rowPageForm'), `${location} requires list.rowPageForm.`);
        issue(errors, action.form && Array.isArray(action.form.groups) && action.form.groups.length > 0, `${location}.form.groups are required.`);
        const actionFields = (action.form?.groups || []).flatMap((group) => group.fields || []);
        actionFields.forEach((field, fieldIndex) => validateField(errors, field, `${location}.form.fields[${fieldIndex}]`));
        issue(errors, unique(actionFields.map((field) => field.key)), `${location}.form field keys must be unique.`);
        issue(errors, action.form?.submit && text(action.form.submit.primaryLabel), `${location}.form.submit.primaryLabel is required.`);
      }
    });
  });
  const rows = table.rows || [];
  const ids = rows.map((row) => row?.[table.rowKey]);
  issue(errors, ids.every((id) => id !== undefined && id !== null && id !== ''), `Every row requires ${table.rowKey}.`);
  issue(errors, unique(ids), `list.table.${table.rowKey} values must be unique.`);
  if (table.tools?.includes('settings')) issue(errors, capabilities.includes('table.columnSettings'), 'settings requires table.columnSettings.');
  if ((table.rowActions || []).some((action) => action.confirm)) issue(errors, capabilities.includes('table.confirmAction'), 'Confirmed actions require table.confirmAction.');
  if (table.pagination?.total !== undefined) issue(errors, table.pagination.total === rows.length, 'Prototype pagination.total must equal rows.length.');
  if (table.drawerDetail) {
    issue(errors, capabilities.includes('detail.drawer'), 'drawerDetail requires detail.drawer.');
    issue(errors, Array.isArray(table.drawerDetail.groups) && table.drawerDetail.groups.length > 0, 'drawerDetail.groups are required.');
  }
  const actionColumn = columns.find((column) => column.key === 'actions');
  const rowActions = table.rowActions || [];
  if (rowActions.length) {
    issue(errors, Boolean(actionColumn), 'Row actions require an actions column.');
    issue(errors, actionColumn?.hideable === false, 'Operation columns must declare hideable=false.');
  }
  issue(errors, unique(rowActions.map((action) => action?.key)), 'list.table.rowActions keys must be unique.');
  rowActions.forEach((action, index) => {
    const location = `list.table.rowActions[${index}]`;
    issue(errors, text(action?.key) && text(action?.label), `${location} requires key and label.`);
    issue(errors, ['detail', 'edit', 'confirm-state-change', 'delete'].includes(action?.type), `${location}.type is unsupported.`);
    if (action?.type === 'detail') issue(errors, capabilities.includes('detail.drawer'), 'Detail row actions require detail.drawer.');
    if (action?.type === 'edit') {
      issue(errors, capabilities.includes('table.editAction'), 'Edit row actions require table.editAction.');
      issue(errors, action.form && Array.isArray(action.form.fields) && action.form.fields.length > 0, `${location}.form.fields are required.`);
      (action.form?.fields || []).forEach((field, fieldIndex) => validateField(errors, field, `${location}.form.fields[${fieldIndex}]`));
    }
    if (action?.type === 'confirm-state-change') {
      issue(errors, capabilities.includes('table.confirmAction'), 'State-changing row actions require table.confirmAction.');
      issue(errors, action.effect && text(action.effect.field) && Object.hasOwn(action.effect, 'value'), `${location}.effect is required.`);
      issue(errors, action.confirm && text(action.confirm.title) && text(action.confirm.description) && text(action.confirm.impact), `${location}.confirm requires title, description and impact.`);
    }
    if (action?.type === 'delete') {
      issue(errors, capabilities.includes('table.deleteAction'), 'Delete row actions require table.deleteAction.');
      issue(errors, action.confirm && text(action.confirm.title) && text(action.confirm.description) && text(action.confirm.impact), `${location}.confirm requires title, description and impact.`);
    }
  });
  if (table.batchActions?.length) {
    issue(errors, capabilities.includes('table.batchAction'), 'Batch actions require table.batchAction.');
    issue(errors, table.rowSelection === true, 'Batch actions require table.rowSelection=true.');
    issue(errors, unique(table.batchActions.map((action) => action?.key)), 'list.table.batchActions keys must be unique.');
    table.batchActions.forEach((action, index) => {
      issue(errors, text(action?.key) && text(action?.label), `list.table.batchActions[${index}] requires key and label.`);
      if (action?.type !== 'delete') issue(errors, action?.effect && text(action.effect.field) && Object.hasOwn(action.effect, 'value'), `list.table.batchActions[${index}].effect is required.`);
    });
  }
  if (table.expandable) {
    issue(errors, capabilities.includes('table.expandable'), 'Expandable rows require table.expandable.');
    issue(errors, table.rowSelection !== true, 'Expandable rows and rowSelection cannot be combined.');
    const child = table.expandable.childTable;
    issue(errors, child && text(child.rowsSource) && text(child.rowKey) && Array.isArray(child.columns) && child.columns.length > 0, 'table.expandable.childTable requires rowsSource, rowKey and columns.');
  }
  if ((table.tools || []).includes('refresh')) issue(errors, capabilities.includes('table.refresh'), 'refresh requires table.refresh.');
  if ((table.tools || []).includes('export')) issue(errors, capabilities.includes('table.export'), 'export requires table.export.');
  if (table.columnSettings?.allowOrder) issue(errors, capabilities.includes('table.columnOrder'), 'Column ordering requires table.columnOrder.');
  (table.secondaryActions || []).forEach((action, index) => {
    issue(errors, text(action?.key) && text(action?.label), `list.table.secondaryActions[${index}] requires key and label.`);
    if (action?.type === 'export') issue(errors, capabilities.includes('table.export'), 'Export actions require table.export.');
  });
  if (list.summary?.items?.length) {
    issue(errors, capabilities.includes('summary.inline'), 'Inline summary requires summary.inline.');
    issue(errors, list.summary.items.length <= 2, 'Inline summary supports at most two items.');
  }
  if (list.statistics?.items?.length) {
    issue(errors, capabilities.includes('statistics.cards'), 'Statistics cards require statistics.cards.');
    issue(errors, list.statistics.items.length >= 3 && list.statistics.items.length <= 5, 'Statistics cards require three to five items.');
  }
  issue(errors, !(list.summary?.items?.length && list.statistics?.items?.length), 'Inline summary and statistics cards cannot be combined.');
  if (table.primaryAction) {
    const action = table.primaryAction;
    const presentation = action.presentation || 'modal';
    const createForm = action.form;
    issue(errors, text(action.label), 'table.primaryAction.label is required.');
    issue(errors, ['modal', 'drawer', 'page'].includes(presentation), 'table.primaryAction.presentation must be modal, drawer or page.');
    issue(errors, createForm && typeof createForm === 'object', 'table.primaryAction.form is required.');
    if (!createForm) return;
    const createFields = presentation === 'page'
      ? (createForm.groups || []).flatMap((group) => group.fields || [])
      : (createForm.fields || []);
    createFields.forEach((field, index) => validateField(errors, field, `table.primaryAction.form.fields[${index}]`));
    issue(errors, unique(createFields.map((field) => field.key)), 'Create form field keys must be unique.');
    issue(errors, createForm.submit && text(createForm.submit.primaryLabel), 'table.primaryAction.form.submit.primaryLabel is required.');
    if (presentation === 'modal') {
      issue(errors, capabilities.includes('list.modalCreate'), 'Modal create requires list.modalCreate.');
      issue(errors, Array.isArray(createForm.fields) && createForm.fields.length > 0, 'Modal create requires form.fields.');
    }
    if (presentation === 'drawer') {
      issue(errors, capabilities.includes('list.drawerCreate'), 'Drawer create requires list.drawerCreate.');
      issue(errors, Array.isArray(createForm.fields) && createForm.fields.length > 0, 'Drawer create requires form.fields.');
      issue(errors, createFields.length <= 10, 'Drawer create supports at most ten fields.');
    }
    if (presentation === 'page') {
      issue(errors, capabilities.includes('list.pageCreate'), 'Page create requires list.pageCreate.');
      issue(errors, Array.isArray(createForm.groups) && createForm.groups.length >= 2, 'Page create requires at least two business groups.');
      issue(errors, createFields.length > 8 || (createForm.groups || []).length >= 2, 'Page create requires more than eight fields or multiple business groups.');
      issue(errors, createForm.stickyActions === true, 'Page create requires stickyActions=true.');
    }
  }
}

function fieldsForForm(form) {
  if (Array.isArray(form.fields)) return form.fields;
  if (Array.isArray(form.groups)) return form.groups.flatMap((group) => group.fields || []);
  if (Array.isArray(form.steps)) return form.steps.flatMap((step) => step.fields || []);
  return [];
}

function validateForm(errors, spec, capabilities) {
  const form = spec.form;
  issue(errors, form && typeof form === 'object', 'form is required for family=form.');
  if (!form) return;
  const structures = [Array.isArray(form.fields), Array.isArray(form.groups), Array.isArray(form.steps)].filter(Boolean).length;
  issue(errors, structures === 1, 'Form must declare exactly one of fields, groups or steps.');
  if (form.fields) issue(errors, capabilities.includes('form.simple'), 'form.fields requires form.simple.');
  if (form.groups) issue(errors, capabilities.includes('form.groups'), 'form.groups requires form.groups.');
  if (form.steps) issue(errors, capabilities.includes('form.steps'), 'form.steps requires form.steps.');
  const fields = fieldsForForm(form);
  fields.forEach((field, index) => validateField(errors, field, `form.fields[${index}]`));
  issue(errors, unique(fields.map((field) => field.key)), 'Form field keys must be unique.');
  issue(errors, ['page', 'drawer', 'modal'].includes(form.presentation || 'page'), 'form.presentation must be page, drawer or modal.');
  if ((form.presentation || 'page') === 'modal') issue(errors, fields.length <= 6, 'Modal forms support at most 6 fields; use a Drawer form.');
  if ((form.presentation || 'page') === 'drawer') issue(errors, fields.length <= 10, 'Drawer forms support at most 10 fields; use a page form.');
  if (form.groups) {
    issue(errors, form.groups.length >= 2, 'Grouped forms require at least two business groups.');
    form.groups.forEach((group, index) => {
      issue(errors, text(group?.key) && text(group?.title), `form.groups[${index}] requires key and title.`);
      issue(errors, Array.isArray(group?.fields) && group.fields.length > 0, `form.groups[${index}].fields are required.`);
    });
  }
  if (form.steps) {
    issue(errors, form.steps.length >= 2, 'Step forms require at least two steps.');
    issue(errors, (form.steps || []).every((step) => text(step?.key) && text(step?.title) && (step.review === true || (Array.isArray(step?.fields) && step.fields.length > 0))), 'Every form step requires key, title and fields or review=true.');
    if ((form.steps || []).some((step) => step.review === true)) issue(errors, capabilities.includes('form.review'), 'Review steps require form.review.');
    if ((form.steps || []).some((step) => step.previewTable)) issue(errors, capabilities.includes('form.reviewTable'), 'Review tables require form.reviewTable.');
  }
  if (form.stickyActions === true) issue(errors, capabilities.includes('form.stickyActions'), 'stickyActions requires form.stickyActions.');
  if (form.sideGuide) issue(errors, capabilities.includes('form.sideGuide'), 'sideGuide requires form.sideGuide.');
  if (fields.some((field) => field.control === 'upload')) issue(errors, capabilities.includes('form.upload'), 'Upload fields require form.upload.');
  issue(errors, form.submit && text(form.submit.primaryLabel), 'form.submit.primaryLabel is required.');
  const success = form.submit?.success;
  if (success?.summary) {
    issue(errors, capabilities.includes('form.resultSummary'), 'form.submit.success.summary requires form.resultSummary.');
    issue(errors, Array.isArray(success.summary.items) && success.summary.items.length >= 2, 'form.submit.success.summary.items must contain at least two items.');
  }
  if (success?.feedback) issue(errors, capabilities.includes('form.resultFeedback'), 'form.submit.success.feedback requires form.resultFeedback.');
  if (success?.actionType === 'return-source') issue(errors, capabilities.includes('form.returnSource'), 'return-source success actions require form.returnSource.');
}

function validateDetail(errors, spec, capabilities) {
  const detail = spec.detail;
  issue(errors, detail && typeof detail === 'object', 'detail is required for family=detail.');
  if (!detail) return;
  issue(errors, Array.isArray(detail.groups) && detail.groups.length > 0, 'detail.groups are required.');
  issue(errors, capabilities.includes('detail.groups'), 'Detail requires detail.groups.');
  (detail.groups || []).forEach((group, index) => {
    issue(errors, text(group.key) && text(group.title), `detail.groups[${index}] requires key and title.`);
    issue(errors, Array.isArray(group.fields) || group.table, `detail.groups[${index}] requires fields or table.`);
    (group.fields || []).forEach((field, fieldIndex) => {
      const location = `detail.groups[${index}].fields[${fieldIndex}]`;
      issue(errors, text(field?.key) && text(field?.label), `${location} requires key and label.`);
      if (field?.format === 'status') issue(errors, field.value !== undefined || field.statusMap, `${location} status requires value or statusMap.`);
    });
    if (group.table) {
      issue(errors, capabilities.includes('detail.embeddedTable'), 'Embedded detail tables require detail.embeddedTable.');
      issue(errors, text(group.table.rowKey), `detail.groups[${index}].table.rowKey is required.`);
      issue(errors, Array.isArray(group.table.columns) && group.table.columns.length > 0, `detail.groups[${index}].table.columns are required.`);
      issue(errors, Array.isArray(group.table.rows), `detail.groups[${index}].table.rows must be an array.`);
    }
  });
  if (detail.metrics?.length) {
    issue(errors, capabilities.includes('detail.metrics'), 'Detail metrics require detail.metrics.');
    issue(errors, unique(detail.metrics.map((metric) => metric?.key)), 'detail.metrics keys must be unique.');
    detail.metrics.forEach((metric, index) => issue(errors, text(metric?.key) && text(metric?.label) && metric.value !== undefined, `detail.metrics[${index}] requires key, label and value.`));
  }
  if (detail.presentation === 'modal') issue(errors, capabilities.includes('detail.modal'), 'Modal detail requires detail.modal.');
  if (detail.presentation === 'drawer') issue(errors, capabilities.includes('detail.drawer'), 'Drawer detail requires detail.drawer.');
  issue(errors, ['page', 'modal', 'drawer'].includes(detail.presentation || 'page'), 'detail.presentation must be page, modal or drawer.');
  if (detail.anchors) issue(errors, capabilities.includes('detail.anchors'), 'Detail anchors require detail.anchors.');
  if (detail.tabs?.length) {
    issue(errors, capabilities.includes('detail.tabs'), 'Detail tabs require detail.tabs.');
    issue(errors, unique(detail.tabs.map((tab) => tab?.key)), 'detail.tabs keys must be unique.');
    detail.tabs.forEach((tab, index) => {
      issue(errors, text(tab?.key) && text(tab?.label), `detail.tabs[${index}] requires key and label.`);
      issue(errors, Array.isArray(tab?.groupKeys) && tab.groupKeys.length > 0, `detail.tabs[${index}].groupKeys are required.`);
      (tab?.groupKeys || []).forEach((key) => issue(errors, (detail.groups || []).some((group) => group.key === key), `detail.tabs[${index}] references unknown group ${key}.`));
    });
  }
}

function validateResultSummary(errors, summary, capabilities) {
  if (summary === undefined) return;
  issue(errors, summary && typeof summary === 'object' && !Array.isArray(summary), 'result.summary must be an object.');
  issue(errors, Array.isArray(summary?.items) && summary.items.length >= 2 && summary.items.length <= 6, 'result.summary.items must contain 2 to 6 items.');
  if (summary?.items) {
    issue(errors, unique(summary.items.map((item) => item?.key)), 'result.summary.items keys must be unique.');
    summary.items.forEach((item, index) => issue(errors, text(item?.key) && text(item?.label) && item.value !== undefined, `result.summary.items[${index}] requires key, label and value.`));
  }
  issue(errors, capabilities.includes('result.summary'), 'result.summary requires result.summary.');
}

function validateResult(errors, spec, capabilities, allowWorkflowResult) {
  const result = spec.result;
  issue(errors, allowWorkflowResult, 'Result is workflow-only and cannot be built as a direct entry.');
  issue(errors, result && typeof result === 'object', 'result is required for family=result.');
  if (!result) return;
  issue(errors, capabilities.includes('result.basic'), 'Result requires result.basic.');
  issue(errors, ['success', 'error', 'info', 'warning'].includes(result.status || 'success'), 'result.status is unsupported.');
  issue(errors, text(result.title), 'result.title is required.');
  validateResultSummary(errors, result.summary, capabilities);
  if (result.feedback) {
    issue(errors, capabilities.includes('result.feedback'), 'result.feedback requires result.feedback.');
    issue(errors, text(result.feedback.question), 'result.feedback.question is required.');
  }
  if (result.actions) {
    issue(errors, Array.isArray(result.actions), 'result.actions must be an array.');
    (result.actions || []).forEach((action, index) => issue(errors, text(action?.key) && text(action?.label), `result.actions[${index}] requires key and label.`));
  }
}

export function validatePageSpec(spec, { root = ROOT, allowWorkflowResult = false, allowShellPages = true } = {}) {
  const errors = [];
  issue(errors, spec && typeof spec === 'object' && !Array.isArray(spec), 'Page Spec must be an object.');
  if (!spec || typeof spec !== 'object') return errors;
  issue(errors, spec.schemaVersion === 1, 'schemaVersion must be 1.');
  const allowed = new Set(['schemaVersion', 'metadata', 'ui', 'shell', 'content', 'list', 'form', 'detail', 'result', 'states']);
  Object.keys(spec).filter((key) => !allowed.has(key)).forEach((key) => errors.push(`Unsupported top-level Page Spec key: ${key}.`));
  issue(errors, spec.ui?.system === 'easy-account', 'ui.system must be easy-account.');
  issue(errors, spec.ui?.runtime === 'easy-account-page-spec', 'ui.runtime must be easy-account-page-spec.');
  issue(errors, spec.ui?.rendererVersion === 1, 'ui.rendererVersion must be 1.');
  issue(errors, /^\d{8}-[a-z0-9-]+$/.test(spec.metadata?.changeId || ''), 'metadata.changeId must use YYYYMMDD-lowercase-slug.');
  issue(errors, text(spec.metadata?.pageName), 'metadata.pageName is required.');
  const family = spec.metadata?.family;
  issue(errors, ['list', 'form', 'detail', 'result'].includes(family), 'metadata.family is unsupported.');
  const templates = { list: /^list\./, form: /^form\./, detail: /^detail\./, result: /^result\./ };
  if (templates[family]) issue(errors, templates[family].test(spec.metadata?.templateId || ''), `templateId is not valid for ${family}.`);
  const policy = loadPolicy(root);
  const selected = policy.families.find((entry) => entry.id === family);
  issue(errors, Boolean(selected), `No generation policy for family ${family || '<empty>'}.`);
  if (selected) {
    issue(errors, selected.availability === 'available', `${family} is ${selected.availability}.`);
    issue(errors, selected.mode !== 'legacy', `${family} is configured for legacy mode.`);
  }
  const capabilities = spec.content?.capabilities;
  issue(errors, Array.isArray(capabilities) && unique(capabilities), 'content.capabilities must be a unique array.');
  if (selected && Array.isArray(capabilities)) {
    const allowedCapabilities = new Set(selected.capabilities);
    capabilities.filter((capability) => !allowedCapabilities.has(capability)).forEach((capability) => errors.push(`Unsupported ${family} capability: ${capability}.`));
  }
  const refs = spec.metadata?.ruleRefs;
  issue(errors, Array.isArray(refs) && refs.length > 0 && unique(refs), 'metadata.ruleRefs must be a non-empty unique array.');
  if (Array.isArray(refs)) refs.filter((ref) => !knownRuleIds(root).has(ref)).forEach((ref) => errors.push(`Unknown Director Rule ID: ${ref}.`));
  if (family === 'list') validateList(errors, spec, capabilities || []);
  if (family === 'form') validateForm(errors, spec, capabilities || []);
  if (family === 'detail') validateDetail(errors, spec, capabilities || []);
  if (family === 'result') validateResult(errors, spec, capabilities || [], allowWorkflowResult);
  if (spec.shell?.pages !== undefined) {
    const pages = spec.shell.pages;
    issue(errors, allowShellPages, 'Nested shell pages are not supported.');
    issue(errors, Array.isArray(pages) && pages.length > 0, 'shell.pages must be a non-empty array.');
    if (Array.isArray(pages)) {
      issue(errors, unique(pages.map((page) => page?.tabId)), 'shell.pages tabId values must be unique.');
      pages.forEach((page, index) => {
        issue(errors, text(page?.tabId), `shell.pages[${index}].tabId is required.`);
        issue(errors, page?.spec && typeof page.spec === 'object', `shell.pages[${index}].spec is required.`);
        if (page?.spec && typeof page.spec === 'object') {
          validatePageSpec(page.spec, { root, allowWorkflowResult, allowShellPages: false })
            .forEach((error) => errors.push(`shell.pages[${index}].spec: ${error}`));
          issue(errors, page.spec.metadata?.changeId === spec.metadata?.changeId, `shell.pages[${index}].spec must share the parent changeId.`);
        }
      });
    }
  }
  return errors;
}

export function resolveShellActiveTabId(shell = {}, shellConfig = {}) {
  if (typeof shell.activeTabId === 'string' && shell.activeTabId.trim()) return shell.activeTabId;
  const groups = Array.isArray(shellConfig.menu) ? shellConfig.menu : [];
  const primaryGroup = groups.find((group) => group?.label === shell.primaryNav);
  const matchedItem = (primaryGroup?.children || []).find((item) => item?.label === shell.sideNav)
    || groups.flatMap((group) => group?.children || []).find((item) => item?.label === shell.sideNav);
  if (matchedItem?.id) return String(matchedItem.id);
  if (shellConfig.activeTabId) return String(shellConfig.activeTabId);
  return shellConfig.tabs?.[0]?.id ? String(shellConfig.tabs[0].id) : '';
}

export function generatedPreviewApp(spec) {
  const serialized = JSON.stringify(spec, null, 2).replace(/<\//g, '<\\/');
  return `// Derived from page-spec.json. Do not edit.\n// page-spec-sha256: ${pageSpecHash(spec)}\ndocument.addEventListener('DOMContentLoaded', function () {\n  const spec = ${serialized};\n  const shellConfig = Object.assign({}, window.EASY_ACCOUNT_SHELL_CONFIG || {}, spec.shell || {});\n  const activeTabId = (${resolveShellActiveTabId.toString()})(spec.shell || {}, shellConfig);\n  const pageEntries = [{ tabId: activeTabId, spec: spec }].concat((spec.shell && spec.shell.pages || []).map(function (page) { return { tabId: page.tabId, spec: page.spec }; }));\n  const contentByTab = Object.assign({}, spec.shell && spec.shell.contentByTab || {});\n  const tabs = (shellConfig.tabs || []).map(function (tab) { return Object.assign({}, tab); });\n  pageEntries.forEach(function (page) {\n    page.root = document.createElement('div');\n    if (page.tabId) {\n      contentByTab[page.tabId] = page.root;\n      if (!tabs.some(function (tab) { return tab.id === page.tabId; })) {\n        tabs.push({ id: page.tabId, label: page.spec.metadata.pageName, closable: true });\n      }\n    }\n  });\n  const shell = window.EasyAccountShell.mount(Object.assign({}, shellConfig, { tabs: tabs, activeTabId: activeTabId, content: '', contentByTab: contentByTab }));\n  pageEntries.forEach(function (page) {\n    window.EasyAccountPageSpecRuntime.mount(page.spec, page.tabId ? page.root : shell.contentSlot);\n  });\n});\n`;
}

export function assertChangeSpecPath(root, specPath) {
  const absolute = resolve(root, specPath);
  const changesRoot = resolve(root, 'changes');
  if (!absolute.startsWith(`${changesRoot}/`) || basename(absolute) !== 'page-spec.json' || !existsSync(absolute)) {
    throw new Error('Page Spec must be an existing changes/{change-id}/page-spec.json file.');
  }
  return absolute;
}

export function changeDirFromSpec(specPath) { return dirname(specPath); }
