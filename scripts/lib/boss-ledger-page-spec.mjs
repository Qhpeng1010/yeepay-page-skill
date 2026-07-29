// rule-assertion: contract.metadata-selection
// rule-assertion: contract.list-actions
// rule-assertion: contract.list-drawer-detail
// rule-assertion: contract.family-structure
// rule-assertion: contract.form-workflow
// rule-assertion: contract.detail-structure
// rule-assertion: contract.result-boundary
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

export const ROOT = resolve(new URL('../..', import.meta.url).pathname);
export const EXECUTION_ROOT = resolve(ROOT, 'modules/boss-ledger/execution');

export function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

export function loadPolicy(root = ROOT) {
  return readJson(resolve(root, 'modules/boss-ledger/execution/generation-policy.json'));
}

export function familyPolicy(policy, family) {
  return policy.families.find((entry) => entry.id === family) || null;
}

const TEMPLATE_INTENTS = Object.freeze({
  'template-03-query-list-regular': 'query-list',
  'template-04-query-list-inline-summary': 'inline-summary-list',
  'template-05-query-list-card-summary': 'card-summary-list',
  'template-06-modal-form': 'modal-form',
  'template-07-drawer-form': 'drawer-form',
  'template-08-full-page-form': 'full-page-form',
  'template-13-guided-form': 'guided-form',
  'template-09-drawer-detail': 'detail',
  'template-10-wizard': 'wizard',
  'template-11-result': 'result'
});

export function templateIntent(templateId) {
  return TEMPLATE_INTENTS[String(templateId || '').replace(/\.md$/, '')] || null;
}

export function expectedRuntimeMode(policy, family, templateId) {
  const selected = familyPolicy(policy, family);
  return selected?.intentModes?.[templateIntent(templateId)] || selected?.mode || null;
}

function issue(errors, condition, message) {
  if (!condition) errors.push(message);
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function unique(values) {
  return new Set(values).size === values.length;
}

function sameSet(left, right) {
  const first = new Set(left || []);
  const second = new Set(right || []);
  return first.size === second.size && [...first].every((value) => second.has(value));
}

function collectKnownRuleIds(root) {
  const files = [
    '01-visual-constitution.md',
    '02-template-application-rules.md',
    '03-interaction-acceptance-rules.md'
  ];
  const source = files.map((file) => readFileSync(resolve(root, 'modules/boss-ledger/director-rules', file), 'utf8')).join('\n');
  return new Set(source.match(/BL-(?:VIS|TPL|INT)-\d{3}/g) || []);
}

function validateField(errors, field, location) {
  issue(errors, field && typeof field === 'object' && !Array.isArray(field), `${location} must be an object.`);
  if (!field || typeof field !== 'object') return;
  issue(errors, nonEmptyString(field.key), `${location}.key is required.`);
  issue(errors, nonEmptyString(field.label), `${location}.label is required.`);
  issue(errors, ['input', 'textarea', 'select', 'date', 'date-range', 'number', 'radio', 'switch', 'upload'].includes(field.control), `${location}.control is unsupported.`);
  if (['select', 'radio'].includes(field.control)) {
    issue(errors, Array.isArray(field.options) && field.options.length > 0, `${location}.options are required for ${field.control}.`);
  }
  if (field.options) {
    field.options.forEach((option, index) => {
      issue(errors, nonEmptyString(option?.label), `${location}.options[${index}].label is required.`);
      issue(errors, option && Object.hasOwn(option, 'value'), `${location}.options[${index}].value is required.`);
    });
  }
}

function validateListDrawerDetail(errors, table, capabilities, columnKeys) {
  const detailActions = (table.rowActions || []).filter((action) => action?.type === 'detail');
  const drawerDetail = table.drawerDetail;
  if (detailActions.length) {
    issue(errors, detailActions.length === 1, 'A list Page Spec supports exactly one detail row action.');
    issue(errors, capabilities.includes('detail.drawer'), 'Detail row actions require detail.drawer.');
    issue(errors, drawerDetail && typeof drawerDetail === 'object', 'Detail row actions require table.drawerDetail.');
  }
  if (!drawerDetail) return;
  issue(errors, detailActions.length === 1, 'table.drawerDetail requires one detail row action.');
  issue(errors, nonEmptyString(drawerDetail.title), 'table.drawerDetail.title is required.');
  issue(errors, Array.isArray(drawerDetail.groups) && drawerDetail.groups.length > 0, 'table.drawerDetail.groups are required.');
  issue(errors, nonEmptyString(drawerDetail.closeLabel), 'table.drawerDetail.closeLabel is required.');
  const fieldKeys = [];
  (drawerDetail.groups || []).forEach((group, groupIndex) => {
    issue(errors, nonEmptyString(group?.key) && nonEmptyString(group?.title), `table.drawerDetail.groups[${groupIndex}] requires key and title.`);
    issue(errors, (Array.isArray(group?.fields) && group.fields.length > 0) || (group?.table && typeof group.table === 'object'), `table.drawerDetail.groups[${groupIndex}] requires fields or a table.`);
    (group?.fields || []).forEach((field, fieldIndex) => {
      const location = `table.drawerDetail.groups[${groupIndex}].fields[${fieldIndex}]`;
      issue(errors, nonEmptyString(field?.key), `${location}.key is required.`);
      issue(errors, nonEmptyString(field?.label), `${location}.label is required.`);
      issue(errors, nonEmptyString(field?.source), `${location}.source is required.`);
      issue(errors, columnKeys.includes(field?.source), `${location}.source must reference a list column.`);
      if (field?.format === 'status') issue(errors, field.statusMap && typeof field.statusMap === 'object', `${location}.statusMap is required for status fields.`);
      fieldKeys.push(field?.key);
    });
    if (group?.table) {
      issue(errors, capabilities.includes('detail.drawerTable'), `table.drawerDetail.groups[${groupIndex}].table requires detail.drawerTable.`);
      issue(errors, nonEmptyString(group.table.rowKey), `table.drawerDetail.groups[${groupIndex}].table.rowKey is required.`);
      issue(errors, Array.isArray(group.table.columns) && group.table.columns.length > 0, `table.drawerDetail.groups[${groupIndex}].table.columns are required.`);
      issue(errors, nonEmptyString(group.table.rowsSource) || Array.isArray(group.table.rows), `table.drawerDetail.groups[${groupIndex}].table requires rowsSource or rows.`);
    }
  });
  issue(errors, unique(fieldKeys), 'table.drawerDetail field keys must be unique.');
}

function validateEmbeddedActionForm(errors, form, location) {
  issue(errors, form && typeof form === 'object', `${location}.form is required.`);
  if (!form || typeof form !== 'object') return;
  issue(errors, nonEmptyString(form.title), `${location}.form.title is required.`);
  issue(errors, Array.isArray(form.fields) && form.fields.length > 0, `${location}.form.fields are required.`);
  (form.fields || []).forEach((field, index) => validateField(errors, field, `${location}.form.fields[${index}]`));
  issue(errors, unique((form.fields || []).map((field) => field.key)), `${location}.form field keys must be unique.`);
  issue(errors, nonEmptyString(form.primaryLabel), `${location}.form.primaryLabel is required.`);
  issue(errors, nonEmptyString(form.successMessage), `${location}.form.successMessage is required.`);
}

function validateRowActions(errors, table, capabilities, columnKeys) {
  const actions = table.rowActions || [];
  issue(errors, unique(actions.map((action) => action?.key)), 'list.table.rowActions keys must be unique.');
  actions.forEach((action, index) => {
    const location = `list.table.rowActions[${index}]`;
    issue(errors, action && typeof action === 'object', `${location} must be an object.`);
    if (!action || typeof action !== 'object') return;
    issue(errors, nonEmptyString(action.key), `${location}.key is required.`);
    issue(errors, nonEmptyString(action.label), `${location}.label is required.`);
    if (action.type) issue(errors, ['detail', 'confirm-state-change', 'edit'].includes(action.type), `${location}.type is unsupported.`);
    if (action.visibleWhen) {
      issue(errors, action.visibleWhen && typeof action.visibleWhen === 'object', `${location}.visibleWhen must be an object.`);
      issue(errors, columnKeys.includes(action.visibleWhen?.field), `${location}.visibleWhen.field must reference a list column.`);
      issue(errors, Object.hasOwn(action.visibleWhen, 'equals'), `${location}.visibleWhen.equals is required.`);
    }
    if (action.type === 'confirm-state-change') {
      issue(errors, capabilities.includes('table.confirmAction'), 'State-changing row actions require table.confirmAction.');
      issue(errors, action.confirm && typeof action.confirm === 'object', `${location}.confirm must be an object for state-changing actions.`);
      ['title', 'description', 'impact', 'successMessage'].forEach((key) => issue(errors, nonEmptyString(action.confirm?.[key]), `${location}.confirm.${key} is required.`));
      issue(errors, action.effect && typeof action.effect === 'object', `${location}.effect is required for state-changing actions.`);
      issue(errors, columnKeys.includes(action.effect?.field), `${location}.effect.field must reference a list column.`);
      issue(errors, action.effect && Object.hasOwn(action.effect, 'value'), `${location}.effect.value is required.`);
    }
    if (action.type === 'edit') {
      issue(errors, capabilities.includes('table.editAction'), 'Edit row actions require table.editAction.');
      validateEmbeddedActionForm(errors, action.form, location);
    }
  });
}

function validateList(errors, spec, capabilities) {
  const list = spec.list;
  issue(errors, list && typeof list === 'object', 'list is required for family=list.');
  if (!list) return;
  const fields = list.query?.fields;
  issue(errors, Array.isArray(fields), 'list.query.fields must be an array.');
  (fields || []).forEach((field, index) => validateField(errors, field, `list.query.fields[${index}]`));
  const advanced = capabilities.includes('query.advanced');
  const basic = capabilities.includes('query.basic');
  issue(errors, Number(advanced) + Number(basic) === 1, 'List Page Spec requires exactly one of query.basic or query.advanced.');
  if (basic && (fields || []).length > 6) errors.push('query.basic supports at most 6 fields; use query.advanced.');
  if (advanced && (fields || []).length <= 6) {
    issue(errors, (fields || []).some((field) => field.advanced === true), 'query.advanced with 6 or fewer fields requires at least one advanced field.');
  }

  const table = list.table;
  issue(errors, table && typeof table === 'object', 'list.table is required.');
  if (!table) return;
  issue(errors, nonEmptyString(table.rowKey), 'list.table.rowKey is required.');
  issue(errors, Array.isArray(table.columns) && table.columns.length > 0, 'list.table.columns are required.');
  issue(errors, Array.isArray(table.rows), 'list.table.rows must be an array.');
  issue(errors, table.pagination && Number.isInteger(table.pagination.pageSize), 'list.table.pagination.pageSize is required.');
  issue(errors, capabilities.includes('table.flat'), 'List Page Spec requires table.flat.');
  issue(errors, capabilities.includes('table.pagination'), 'List Page Spec requires table.pagination.');
  const columnKeys = (table.columns || []).map((column) => column.key);
  issue(errors, unique(columnKeys), 'list.table column keys must be unique.');
  (table.columns || []).forEach((column, index) => {
    issue(errors, nonEmptyString(column.key), `list.table.columns[${index}].key is required.`);
    issue(errors, nonEmptyString(column.label), `list.table.columns[${index}].label is required.`);
    if (column.format === 'status') issue(errors, capabilities.includes('table.status'), 'Status columns require table.status.');
    if (column.format === 'amount') issue(errors, capabilities.includes('table.amount'), 'Amount columns require table.amount.');
  });
  const rowActions = table.rowActions || [];
  const actionsColumn = (table.columns || []).find((column) => column.key === 'actions');
  if (rowActions.length) {
    issue(errors, Boolean(actionsColumn), 'Row actions require an actions column.');
    if (actionsColumn) issue(errors, actionsColumn.hideable === false, 'Operation columns must declare hideable=false.');
  }
  if ((table.tools || []).includes('settings') && actionsColumn) {
    issue(errors, actionsColumn.hideable === false, 'Column settings must not hide the operation column.');
  }
  const rowKeys = (table.rows || []).map((row) => row?.[table.rowKey]);
  issue(errors, rowKeys.every((value) => value !== undefined && value !== null && value !== ''), `Every row requires ${table.rowKey}.`);
  issue(errors, unique(rowKeys), `list.table.${table.rowKey} values must be unique.`);
  validateRowActions(errors, table, capabilities, columnKeys);
  validateListDrawerDetail(errors, table, capabilities, columnKeys);
  if (table.primaryAction) {
    issue(errors, capabilities.includes('list.drawerCreate'), 'table.primaryAction requires list.drawerCreate.');
    validateEmbeddedActionForm(errors, table.primaryAction.form, 'list.table.primaryAction');
  }
  if (table.batchActions?.length) {
    issue(errors, capabilities.includes('table.batchAction'), 'Batch actions require table.batchAction.');
    issue(errors, table.rowSelection === true, 'Batch actions require table.rowSelection=true.');
    issue(errors, unique(table.batchActions.map((action) => action?.key)), 'list.table.batchActions keys must be unique.');
    table.batchActions.forEach((action, index) => {
      const location = `list.table.batchActions[${index}]`;
      issue(errors, nonEmptyString(action?.key) && nonEmptyString(action?.label), `${location} requires key and label.`);
      issue(errors, action?.effect && columnKeys.includes(action.effect.field) && Object.hasOwn(action.effect, 'value'), `${location}.effect must reference a table column and value.`);
      if (action?.confirm) ['title', 'description', 'impact', 'successMessage'].forEach((key) => issue(errors, nonEmptyString(action.confirm?.[key]), `${location}.confirm.${key} is required.`));
    });
  } else if (table.rowSelection) {
    issue(errors, capabilities.includes('table.batchAction'), 'table.rowSelection requires table.batchAction.');
  }
  if (table.expandable) {
    issue(errors, capabilities.includes('table.expandable'), 'Expandable rows require table.expandable.');
    issue(errors, table.rowSelection !== true, 'Expandable rows and row selection cannot be combined.');
    const childTable = table.expandable.childTable;
    issue(errors, childTable && typeof childTable === 'object', 'table.expandable.childTable is required.');
    issue(errors, nonEmptyString(childTable?.rowsSource), 'table.expandable.childTable.rowsSource is required.');
    issue(errors, nonEmptyString(childTable?.rowKey), 'table.expandable.childTable.rowKey is required.');
    issue(errors, Array.isArray(childTable?.columns) && childTable.columns.length > 0, 'table.expandable.childTable.columns are required.');
  }
  (table.secondaryActions || []).forEach((action, index) => {
    issue(errors, nonEmptyString(action?.key) && nonEmptyString(action?.label), `list.table.secondaryActions[${index}] requires key and label.`);
    if (action?.type === 'export') issue(errors, capabilities.includes('table.export'), 'Export actions require table.export.');
  });
  if (table.columnSettings?.allowOrder) issue(errors, capabilities.includes('table.columnOrder'), 'Column ordering requires table.columnOrder.');
  if (table.pagination?.total !== undefined) {
    issue(errors, table.pagination.total === (table.rows || []).length, 'Prototype pagination.total must equal rows.length; server pagination is not supported.');
  }
  if ((table.tools || []).includes('settings')) issue(errors, capabilities.includes('table.columnSettings'), 'settings tool requires table.columnSettings.');
  if ((table.tools || []).includes('refresh')) issue(errors, capabilities.includes('table.refresh'), 'refresh tool requires table.refresh.');
  if ((table.rowActions || []).some((action) => action.confirm)) issue(errors, capabilities.includes('table.confirmAction'), 'Confirmed row actions require table.confirmAction.');
  if (list.summary?.items?.length) issue(errors, capabilities.includes('summary.inline'), 'Inline summary requires summary.inline.');
  if (list.statistics?.items?.length) issue(errors, capabilities.includes('statistics.cards'), 'Statistics cards require statistics.cards.');
  issue(errors, !(list.summary?.items?.length && list.statistics?.items?.length), 'Inline summary and statistics cards cannot be combined.');
  if (list.summary?.items) issue(errors, list.summary.items.length <= 2, 'Inline summary supports at most 2 items.');
  if (list.statistics?.items) issue(errors, list.statistics.items.length >= 3 && list.statistics.items.length <= 5, 'Statistics cards require 3 to 5 items.');
  const intent = templateIntent(spec.metadata?.templateId);
  if (intent === 'query-list') {
    issue(errors, !list.summary?.items?.length && !list.statistics?.items?.length, 'template-03-query-list-regular cannot use inline summary or statistics cards.');
  }
  if (intent === 'inline-summary-list') {
    issue(errors, Boolean(list.summary?.items?.length) && !list.statistics?.items?.length, 'template-04-query-list-inline-summary requires inline summary only.');
  }
  if (intent === 'card-summary-list') {
    issue(errors, Boolean(list.statistics?.items?.length) && !list.summary?.items?.length, 'template-05-query-list-card-summary requires statistics cards only.');
  }
}

function allFormFields(form) {
  if (Array.isArray(form.fields)) return form.fields;
  if (Array.isArray(form.groups)) return form.groups.flatMap((group) => group.fields || []);
  if (Array.isArray(form.steps)) return form.steps.flatMap((step) => step.fields || []);
  return [];
}

function validateForm(errors, spec, capabilities) {
  const form = spec.form;
  issue(errors, form && typeof form === 'object', 'form is required for family=form.');
  if (!form) return;
  const fields = allFormFields(form);
  const structures = [Array.isArray(form.fields), Array.isArray(form.groups), Array.isArray(form.steps)].filter(Boolean).length;
  issue(errors, structures === 1, 'Form must declare exactly one of fields, groups or steps.');
  if (form.fields) issue(errors, capabilities.includes('form.simple'), 'form.fields requires form.simple.');
  if (form.groups) issue(errors, capabilities.includes('form.groups'), 'form.groups requires form.groups.');
  if (form.steps) issue(errors, capabilities.includes('form.steps'), 'form.steps requires form.steps.');
  issue(errors, ['page', 'drawer', 'modal'].includes(form.presentation || 'page'), 'form.presentation must be page, drawer or modal.');
  const intent = templateIntent(spec.metadata?.templateId);
  if (intent === 'modal-form') {
    issue(errors, form.presentation === 'modal' && Array.isArray(form.fields), 'template-06-modal-form requires simple fields in a Modal presentation.');
  }
  if (intent === 'drawer-form') {
    issue(errors, form.presentation === 'drawer' && Array.isArray(form.fields), 'template-07-drawer-form requires simple fields in a Drawer presentation.');
  }
  if (intent === 'full-page-form') {
    issue(errors, form.presentation === 'page' && Array.isArray(form.groups), 'template-08-full-page-form requires grouped fields in a page presentation.');
  }
  if (intent === 'guided-form') {
    issue(errors, form.presentation === 'page' && Array.isArray(form.fields), 'template-13-guided-form requires simple fields in a page presentation.');
    issue(errors, capabilities.includes('form.sideGuide'), 'template-13-guided-form requires form.sideGuide.');
    issue(errors, form.sideGuide && nonEmptyString(form.sideGuide.title) && nonEmptyString(form.sideGuide.text), 'template-13-guided-form requires sideGuide title and text.');
  } else if (form.sideGuide !== undefined) {
    errors.push('form.sideGuide is reserved for template-13-guided-form.');
  }
  if (intent === 'wizard') {
    issue(errors, form.presentation === 'page' && Array.isArray(form.steps), 'template-10-wizard requires steps in a page presentation.');
  }
  (form.groups || []).forEach((group, index) => {
    issue(errors, nonEmptyString(group.key) && nonEmptyString(group.title), `form.groups[${index}] requires key and title.`);
    issue(errors, Array.isArray(group.fields) && group.fields.length > 0, `form.groups[${index}].fields are required.`);
  });
  (form.steps || []).forEach((step, index) => {
    issue(errors, nonEmptyString(step.key) && nonEmptyString(step.title), `form.steps[${index}] requires key and title.`);
    issue(errors, nonEmptyString(step.description), `form.steps[${index}].description is required.`);
    issue(errors, Array.isArray(step.fields) || step.review === true, `form.steps[${index}] requires fields or review=true.`);
  });
  if (form.steps) {
    issue(errors, (form.steps || []).some((step) => step.review === true) ? capabilities.includes('form.review') : true, 'Review steps require form.review.');
    issue(errors, form.wizardGuide && typeof form.wizardGuide === 'object', 'form.wizardGuide is required for step forms.');
    issue(errors, nonEmptyString(form.wizardGuide?.title), 'form.wizardGuide.title is required.');
    issue(errors, nonEmptyString(form.wizardGuide?.text), 'form.wizardGuide.text is required.');
    (form.steps || []).filter((step) => step.previewTable).forEach((step, index) => {
      issue(errors, step.review === true, `form.steps[${index}].previewTable requires review=true.`);
      issue(errors, step.previewTable && nonEmptyString(step.previewTable.rowKey), `form.steps[${index}].previewTable.rowKey is required.`);
      issue(errors, Array.isArray(step.previewTable?.columns) && step.previewTable.columns.length > 0, `form.steps[${index}].previewTable.columns are required.`);
      issue(errors, Array.isArray(step.previewTable?.rows), `form.steps[${index}].previewTable.rows are required.`);
    });
    if ((form.steps || []).some((step) => step.previewTable)) issue(errors, capabilities.includes('form.reviewTable'), 'Wizard preview tables require form.reviewTable.');
  } else if (form.wizardGuide !== undefined) {
    errors.push('form.wizardGuide is reserved for template-10-wizard step forms.');
  }
  fields.forEach((field, index) => validateField(errors, field, `form.fields[${index}]`));
  if (fields.some((field) => field.control === 'upload')) issue(errors, capabilities.includes('form.upload'), 'Upload fields require form.upload.');
  issue(errors, unique(fields.map((field) => field.key)), 'Form field keys must be unique.');
  issue(errors, form.submit && nonEmptyString(form.submit.primaryLabel), 'form.submit.primaryLabel is required.');
  issue(errors, form.submit && form.submit.success && nonEmptyString(form.submit.success.message), 'form.submit.success.message is required.');
  if (form.submit?.success?.actionType) {
    issue(errors, ['reset', 'return-source'].includes(form.submit.success.actionType), 'form.submit.success.actionType is unsupported.');
    if (form.submit.success.actionType === 'return-source') issue(errors, capabilities.includes('form.returnSource'), 'return-source success actions require form.returnSource.');
  }
  const failure = form.submit?.failure;
  if (failure) {
    issue(errors, failure && typeof failure === 'object', 'form.submit.failure must be an object.');
    issue(errors, failure.trigger && typeof failure.trigger === 'object', 'form.submit.failure.trigger is required.');
    issue(errors, fields.some((field) => field.key === failure.trigger?.field), 'form.submit.failure.trigger.field must reference a form field.');
    issue(errors, failure.trigger && Object.hasOwn(failure.trigger, 'value'), 'form.submit.failure.trigger.value is required.');
    issue(errors, nonEmptyString(failure.message), 'form.submit.failure.message is required.');
    issue(errors, nonEmptyString(failure.recovery), 'form.submit.failure.recovery is required.');
  }
  if (form.verification) {
    issue(errors, form.verification && typeof form.verification === 'object', 'form.verification must be an object.');
    const values = form.verification?.validValues;
    issue(errors, values && typeof values === 'object' && !Array.isArray(values), 'form.verification.validValues is required.');
    Object.keys(values || {}).forEach((key) => issue(errors, fields.some((field) => field.key === key), `form.verification.validValues.${key} must reference a form field.`));
    fields.filter((field) => field.required).forEach((field) => issue(errors, Object.hasOwn(values || {}, field.key), `form.verification.validValues.${field.key} is required for the required field.`));
    if (failure) issue(errors, values?.[failure.trigger.field] !== failure.trigger.value, 'form.verification.validValues must recover from the declared failure trigger.');
  } else if (failure) {
    errors.push('form.submit.failure requires form.verification.validValues for recovery regression.');
  }
}

function validateDetail(errors, spec, capabilities) {
  const detail = spec.detail;
  issue(errors, detail && typeof detail === 'object', 'detail is required for family=detail.');
  if (!detail) return;
  issue(errors, ['page', 'drawer', 'modal'].includes(detail.presentation || 'page'), 'detail.presentation must be page, drawer or modal.');
  issue(errors, Array.isArray(detail.groups) && detail.groups.length > 0, 'detail.groups are required.');
  issue(errors, capabilities.includes('detail.groups'), 'Detail Page Spec requires detail.groups.');
  (detail.groups || []).forEach((group, index) => {
    issue(errors, nonEmptyString(group.key) && nonEmptyString(group.title), `detail.groups[${index}] requires key and title.`);
    issue(errors, Array.isArray(group.fields) || group.table, `detail.groups[${index}] requires fields or a table.`);
    if (group.table) issue(errors, capabilities.includes('detail.embeddedTable'), 'Embedded detail tables require detail.embeddedTable.');
  });
  if (detail.metrics?.length) issue(errors, capabilities.includes('detail.metrics'), 'Detail metrics require detail.metrics.');
  if (detail.presentation === 'modal') issue(errors, capabilities.includes('detail.modal'), 'Modal detail requires detail.modal.');
  if (detail.presentation === 'drawer') issue(errors, capabilities.includes('detail.drawer'), 'Drawer detail requires detail.drawer.');
  if (detail.anchors) {
    issue(errors, detail.presentation === 'page', 'Detail anchors require page presentation.');
    issue(errors, capabilities.includes('detail.anchors'), 'Detail anchors require detail.anchors.');
  }
  if (detail.tabs) {
    issue(errors, Array.isArray(detail.tabs) && detail.tabs.length > 0, 'detail.tabs must be a non-empty array.');
    issue(errors, capabilities.includes('detail.tabs'), 'Detail tabs require detail.tabs capability.');
    const groupKeys = new Set((detail.groups || []).map((group) => group.key));
    const selected = (detail.tabs || []).flatMap((tab, index) => {
      issue(errors, nonEmptyString(tab?.key) && nonEmptyString(tab?.label), `detail.tabs[${index}] requires key and label.`);
      issue(errors, Array.isArray(tab?.groupKeys) && tab.groupKeys.length > 0, `detail.tabs[${index}].groupKeys are required.`);
      tab?.groupKeys?.forEach((key) => issue(errors, groupKeys.has(key), `detail.tabs[${index}] references unknown group ${key}.`));
      return tab?.groupKeys || [];
    });
    issue(errors, unique(selected) && selected.length === groupKeys.size, 'detail.tabs must assign every detail group exactly once.');
  }
}

function validateResult(errors, spec, capabilities, options) {
  const result = spec.result;
  issue(errors, result && typeof result === 'object', 'result is required for family=result.');
  if (!result) return;
  issue(errors, options.allowWorkflowResult === true, 'Result is workflow-only and cannot be built as a direct entry.');
  issue(errors, capabilities.includes('result.basic'), 'Result Page Spec requires result.basic.');
  issue(errors, ['success', 'error', 'warning', 'info'].includes(result.status), 'result.status is invalid.');
  issue(errors, nonEmptyString(result.title) && nonEmptyString(result.description), 'result.title and result.description are required.');
  issue(errors, Array.isArray(result.actions) && result.actions.length > 0, 'result.actions are required.');
}

export function validatePageSpec(spec, { root = ROOT, allowWorkflowResult = false, allowLegacy = false } = {}) {
  const errors = [];
  issue(errors, spec && typeof spec === 'object' && !Array.isArray(spec), 'Page Spec must be an object.');
  if (!spec || typeof spec !== 'object') return errors;
  issue(errors, spec.schemaVersion === 1, 'schemaVersion must be 1.');
  const allowedTopLevel = new Set(['schemaVersion', 'metadata', 'ui', 'shell', 'content', 'list', 'form', 'detail', 'result', 'states']);
  Object.keys(spec).filter((key) => !allowedTopLevel.has(key)).forEach((key) => errors.push(`Unsupported top-level Page Spec key: ${key}.`));
  issue(errors, spec.ui?.system === 'boss-ledger', 'ui.system must be boss-ledger.');
  issue(errors, spec.ui?.runtime === 'react-antd-page-spec', 'ui.runtime must be react-antd-page-spec.');
  issue(errors, spec.ui?.rendererVersion === 1, 'ui.rendererVersion must be 1.');
  const family = spec.metadata?.family;
  issue(errors, ['list', 'form', 'detail', 'result'].includes(family), 'metadata.family is unsupported.');
  issue(errors, /^\d{8}-[a-z0-9-]+$/.test(spec.metadata?.changeId || ''), 'metadata.changeId must use YYYYMMDD-lowercase-slug.');
  issue(errors, nonEmptyString(spec.metadata?.pageName), 'metadata.pageName is required.');
  issue(errors, nonEmptyString(spec.metadata?.request), 'metadata.request is required.');
  issue(errors, nonEmptyString(spec.metadata?.selectionReason), 'metadata.selectionReason is required.');
  issue(errors, Array.isArray(spec.metadata?.assumptions) && spec.metadata.assumptions.length > 0 && spec.metadata.assumptions.every(nonEmptyString), 'metadata.assumptions must be a non-empty string array.');
  issue(errors, /^template-(0[2-9]|1[0-3])-/.test(spec.metadata?.templateId || ''), 'metadata.templateId is invalid.');
  const familyTemplates = {
    list: /^template-0[3-5]-/,
    form: /^template-(0[6-8]|10|13)-/,
    detail: /^template-09-/,
    result: /^template-11-/
  };
  if (familyTemplates[family]) issue(errors, familyTemplates[family].test(spec.metadata?.templateId || ''), `${spec.metadata?.templateId || '<empty>'} is not a ${family} template.`);

  const policy = loadPolicy(root);
  const selectedPolicy = familyPolicy(policy, family);
  const executionMode = spec.metadata?.executionMode;
  const expectedMode = expectedRuntimeMode(policy, family, spec.metadata?.templateId);
  issue(errors, Boolean(selectedPolicy), `No generation policy for family ${family || '<empty>'}.`);
  if (selectedPolicy && !allowLegacy) {
    issue(errors, selectedPolicy.availability === 'available', `${family} is ${selectedPolicy.availability}, not available for direct Page Spec generation.`);
    issue(errors, selectedPolicy.mode !== 'legacy', `${family} is configured for legacy mode.`);
  }
  issue(errors, ['legacy', 'shadow', 'page-spec-default', 'page-spec-only'].includes(executionMode), 'metadata.executionMode is invalid.');
  if (expectedMode) {
    issue(errors, executionMode === expectedMode, `metadata.executionMode must equal policy mode ${expectedMode} for ${spec.metadata?.templateId || '<empty>'}.`);
  }
  const capabilities = spec.content?.capabilities;
  issue(errors, Array.isArray(capabilities) && unique(capabilities), 'content.capabilities must be a unique array.');
  if (selectedPolicy && Array.isArray(capabilities)) {
    const allowed = new Set(selectedPolicy.capabilities);
    capabilities.filter((capability) => !allowed.has(capability)).forEach((capability) => errors.push(`Unsupported ${family} capability: ${capability}.`));
  }
  const validatedCombinations = spec.metadata?.validatedCombinations;
  if (executionMode === 'shadow') {
    issue(errors, Array.isArray(validatedCombinations) && validatedCombinations.length > 0 && unique(validatedCombinations) && validatedCombinations.every(nonEmptyString), 'shadow Page Spec must declare non-empty unique metadata.validatedCombinations.');
    if (Array.isArray(validatedCombinations) && validatedCombinations.length > 0 && Array.isArray(capabilities)) {
      const combinations = validatedCombinations.map((id) => (policy.validatedCombinations || []).find((entry) => entry.id === id)).filter(Boolean);
      const matchingTemplate = combinations.length === validatedCombinations.length
        && combinations.every((entry) => entry.family === family && entry.templateIds?.includes(spec.metadata?.templateId));
      issue(errors, matchingTemplate, 'metadata.validatedCombinations must reference verified policy combinations for the selected family and template.');
      if (matchingTemplate) {
        const coveredCapabilities = combinations.flatMap((entry) => entry.capabilities || []);
        issue(errors, sameSet(capabilities, coveredCapabilities), 'metadata.validatedCombinations must cover exactly the selected capabilities.');
      }
    }
  } else if (validatedCombinations !== undefined) {
    errors.push('metadata.validatedCombinations is only allowed for shadow Page Specs.');
  }

  const ruleRefs = spec.metadata?.ruleRefs;
  issue(errors, Array.isArray(ruleRefs) && ruleRefs.length > 0 && unique(ruleRefs), 'metadata.ruleRefs must be a non-empty unique array.');
  if (Array.isArray(ruleRefs)) {
    const known = collectKnownRuleIds(root);
    ruleRefs.filter((rule) => !known.has(rule)).forEach((rule) => errors.push(`Unknown Director Rule ID: ${rule}.`));
  }

  if (family === 'list') validateList(errors, spec, capabilities || []);
  if (family === 'form') validateForm(errors, spec, capabilities || []);
  if (family === 'detail') validateDetail(errors, spec, capabilities || []);
  if (family === 'result') validateResult(errors, spec, capabilities || [], { allowWorkflowResult });
  return errors;
}

export function pageSpecHash(spec) {
  return createHash('sha256').update(`${JSON.stringify(spec, null, 2)}\n`).digest('hex');
}

export function generatedPreviewApp(spec) {
  const serialized = JSON.stringify(spec, null, 2).replace(/<\//g, '<\\/');
  const hash = pageSpecHash(spec);
  return `// Derived from page-spec.json. Do not edit.\n// page-spec-sha256: ${hash}\nwindow.BossLedgerPageSpecRuntime.mount(${serialized});\n`;
}

export function assertChangeSpecPath(root, specPath) {
  const absolute = resolve(root, specPath);
  const changesRoot = resolve(root, 'changes');
  if (!absolute.startsWith(`${changesRoot}/`) || basename(absolute) !== 'page-spec.json' || !existsSync(absolute)) {
    throw new Error('Page Spec must be an existing changes/{change-id}/page-spec.json file.');
  }
  return absolute;
}
