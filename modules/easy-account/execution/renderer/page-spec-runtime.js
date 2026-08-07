(function () {
  'use strict';

  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const antd = window.antd;
  const icons = window.icons || window.antdIcons || window.AntDesignIcons || {};
  if (!React || !ReactDOM || !antd) throw new Error('EasyAccountPageSpecRuntime requires React, ReactDOM and Ant Design.');

  const h = React.createElement;
  const {
    Button,
    Checkbox,
    ConfigProvider,
    DatePicker,
    Descriptions,
    Drawer,
    Empty,
    Form,
    Input,
    InputNumber,
    Modal,
    Pagination,
    Popover,
    Radio,
    Result,
    Select,
    Space,
    Statistic,
    Switch,
    Steps,
    Table,
    Tag,
    Tabs,
    TreeSelect,
    Tooltip,
    Upload,
    message
  } = antd;
  const { ArrowLeftOutlined, CloseOutlined, DownloadOutlined, DownOutlined, ReloadOutlined, SettingOutlined, UpOutlined, UploadOutlined } = icons;

  function amount(value) {
    const data = value && typeof value === 'object' ? value : { minor: String(value || '0'), currency: 'CNY' };
    const minor = String(data.minor || '0');
    const negative = minor.startsWith('-');
    const digits = (negative ? minor.slice(1) : minor).padStart(3, '0');
    const major = `${digits.slice(0, -2)}.${digits.slice(-2)}`.replace(/^0+(?=\d)/, '');
    return h(Space, { size: 4 }, `${negative ? '-' : ''}${major}`, h('span', { className: 'ea-ant-currency' }, data.currency || 'CNY'));
  }

  function status(value) {
    const item = value && typeof value === 'object' ? value : { text: String(value || '-'), tone: 'default' };
    const colors = {
      default: 'default',
      error: 'error',
      processing: 'processing',
      success: 'success',
      warning: 'warning'
    };
    return h(Tag, { color: colors[item.tone] || 'default', className: 'ea-status-tag' }, item.text || '-');
  }

  function stackCell(column, row) {
    return h('div', { className: 'ea-stacked-cell' }, ...(column.lines || []).map((line, index) => {
      const value = row[line.source] ?? '-';
      const content = line.prefix ? `${line.prefix}${value}` : String(value);
      return index === 0
        ? h('strong', { key: line.source, title: content }, content)
        : h('span', { key: line.source, title: content }, content);
    }));
  }

  function control(field, id) {
    const placeholder = field.placeholder || (field.control === 'select' ? `请选择${field.label}` : `请输入${field.label}`);
    const common = { id, placeholder, disabled: field.disabled, maxLength: field.maxLength };
    if (field.control === 'select') return h(Select, { ...common, allowClear: true, options: field.options || [] });
    if (field.control === 'radio') return h(Radio.Group, { id, disabled: field.disabled, options: field.options || [] });
    if (field.control === 'tree-select') return h(TreeSelect, {
      ...common,
      allowClear: true,
      treeData: field.treeData || [],
      treeCheckable: field.treeCheckable !== false,
      showCheckedStrategy: TreeSelect?.SHOW_PARENT,
      treeDefaultExpandAll: true,
      style: { width: '100%' }
    });
    if (field.control === 'upload') return h(Upload, {
      id,
      accept: field.accept || 'image/*',
      beforeUpload: () => false,
      maxCount: field.maxCount || 1,
      listType: field.listType || 'picture'
    }, h(Button, { icon: UploadOutlined ? h(UploadOutlined) : null, className: 'ea-upload-trigger' }, field.buttonLabel || '上传文件'));
    if (field.control === 'date') return h(DatePicker, { ...common, format: field.format || 'YYYY-MM-DD', style: { width: '100%' } });
    if (field.control === 'date-range') return h(DatePicker.RangePicker, { ...common, format: field.format || 'YYYY-MM-DD', style: { width: '100%' } });
    if (field.control === 'textarea') return h(Input.TextArea, { ...common, rows: field.rows || 3, showCount: Boolean(field.maxLength) });
    if (field.control === 'number') return h(InputNumber, { id, placeholder, disabled: field.disabled, min: field.min, max: field.max, precision: field.precision, style: { width: '100%' } });
    return h(Input, common);
  }

  function matches(row, fields, filters) {
    return fields.every((field) => {
      const value = filters[field.key];
      if (value === undefined || value === null || value === '') return true;
      const source = row[field.filterKey || field.key];
      const sourceValue = source && typeof source === 'object' ? source.value ?? source.text ?? source.minor : source;
      if (field.control === 'select') return String(sourceValue) === String(value);
      return String(sourceValue || '').toLowerCase().includes(String(value).toLowerCase());
    });
  }

  function formRules(field) {
    const rules = [];
    if (field.required) rules.push({ required: true, message: field.validationMessage || `请填写${field.label}` });
    if (field.validationPattern) rules.push({ pattern: new RegExp(field.validationPattern), message: field.patternMessage || `${field.label}格式不正确` });
    return rules;
  }

  function formItem(field) {
    return h(Form.Item, {
      key: field.key,
      label: field.label,
      name: field.key,
      rules: formRules(field),
      extra: field.help,
      valuePropName: field.control === 'upload' ? 'fileList' : 'value',
      getValueFromEvent: field.control === 'upload' ? (event) => Array.isArray(event) ? event : event?.fileList : undefined
    }, control(field, `form-${field.key}`));
  }

  function detailValue(field, row) {
    return displayValue(row?.[field.source], field);
  }

  function displayValue(value, field = {}) {
    if (field.format === 'amount') {
      if (value && typeof value === 'object' && Object.hasOwn(value, 'minor')) return amount(value);
      const unit = field.unit || field.currency || '';
      return `${value ?? '-'}${unit ? ` ${unit}` : ''}`;
    }
    if (field.format === 'status') {
      const mapped = field.statusMap?.[value];
      return status(mapped || value);
    }
    if (field.format === 'switch') return value === true || value === 'enabled' || value === 'active' ? '可启用' : '禁用';
    return value ?? '-';
  }

  function decimalToAmount(value, currency) {
    const source = String(value ?? '').trim();
    const matched = source.match(/^(-?)(\d+)(?:\.(\d{1,2}))?$/);
    if (!matched) return { minor: '0', currency: currency || 'CNY' };
    const digits = `${matched[2]}${(matched[3] || '').padEnd(2, '0')}`.replace(/^0+(?=\d)/, '');
    return { minor: `${matched[1]}${digits || '0'}`, currency: currency || 'CNY' };
  }

  function formFields(formSpec = {}) {
    if (Array.isArray(formSpec.fields)) return formSpec.fields;
    if (Array.isArray(formSpec.groups)) return formSpec.groups.flatMap((group) => group.fields || []);
    if (Array.isArray(formSpec.steps)) return formSpec.steps.flatMap((step) => step.fields || []);
    return [];
  }

  function dateValue(value, field) {
    if (!value || (typeof value === 'object' && typeof value.isValid === 'function')) return value;
    const createDayjs = window.dayjs;
    if (typeof createDayjs !== 'function') return undefined;
    const parsed = createDayjs(String(value), field.format || 'YYYY-MM-DD');
    return typeof parsed?.isValid === 'function' && parsed.isValid() ? parsed : undefined;
  }

  function normalizeInitialValues(fields, source) {
    const values = { ...(source || {}) };
    (fields || []).forEach((field) => {
      const value = values[field.key];
      if (value === undefined || value === null || value === '') return;
      if (field.control === 'date') values[field.key] = dateValue(value, field);
      if (field.control === 'date-range') {
        const range = Array.isArray(value) ? value : String(value).split(/\s+(?:至|-)\s+/);
        const normalized = range.map((item) => dateValue(item, field)).filter(Boolean);
        values[field.key] = normalized.length === 2 ? normalized : undefined;
      }
      if (['select', 'radio'].includes(field.control) && value && typeof value === 'object') {
        values[field.key] = value.value ?? value.text ?? undefined;
      }
    });
    return values;
  }

  function normalizeRecord(values, defaults, table) {
    const record = { ...(defaults || {}), ...(values || {}) };
    Object.keys(record).forEach((key) => {
      const value = record[key];
      if (value && typeof value.format === 'function') record[key] = value.format('YYYY-MM-DD');
      if (Array.isArray(value) && value.every((item) => item && typeof item.format === 'function')) {
        record[key] = value.map((item) => item.format('YYYY-MM-DD')).join(' - ');
      }
    });
    (table.columns || []).forEach((column) => {
      if (column.format === 'amount' && record[column.key] !== undefined && typeof record[column.key] !== 'object') {
        record[column.key] = decimalToAmount(record[column.key], column.currency);
      }
    });
    return record;
  }

  function ListPage({ spec }) {
    const table = spec.list.table;
    const baseFields = spec.list.query.fields || [];
    const views = table.views || [];
    const primaryAction = table.primaryAction;
    const createConfig = primaryAction?.form;
    const createSubmit = createConfig?.submit || createConfig || {};
    const [queryForm] = Form.useForm();
    const [createForm] = Form.useForm();
    const [allRows, setAllRows] = React.useState(table.rows || []);
    const [filters, setFilters] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [failure, setFailure] = React.useState('');
    const [denied, setDenied] = React.useState(false);
    const [collapsed, setCollapsed] = React.useState(false);
    const [page, setPage] = React.useState(table.pagination?.page || 1);
    const [visibleKeys, setVisibleKeys] = React.useState(() => table.columns.filter((column) => column.hidden !== true).map((column) => column.key));
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [detailRow, setDetailRow] = React.useState(null);
    const [createOpen, setCreateOpen] = React.useState(false);
    const [view, setView] = React.useState('list');
    const [activeView, setActiveView] = React.useState(views[0]?.key);
    const [rowPageAction, setRowPageAction] = React.useState(null);
    const [contextAction, setContextAction] = React.useState(null);
    const [dirty, setDirty] = React.useState(false);
    const [creating, setCreating] = React.useState(false);
    const [selectedKeys, setSelectedKeys] = React.useState([]);
    const [columnOrder, setColumnOrder] = React.useState(() => table.columns.map((column) => column.key));
    const [draggingKey, setDraggingKey] = React.useState('');
    const selectedView = views.find((item) => item.key === activeView);
    const fields = selectedView?.queryFields || baseFields;
    const queryTabs = views.some((item) => Array.isArray(item.queryFields));
    const collapseThreshold = spec.list.query.collapseThreshold || 3;
    const supportsCollapse = fields.length > collapseThreshold;
    const visibleFields = collapsed ? fields.slice(0, collapseThreshold) : fields;
    const viewRows = React.useMemo(() => {
      const viewFilter = selectedView?.filter || {};
      return allRows.filter((row) => Object.entries(viewFilter).every(([key, value]) => String(row[key]) === String(value)));
    }, [allRows, selectedView]);
    const matchedRows = React.useMemo(() => viewRows.filter((row) => matches(row, fields, filters)), [viewRows, fields, filters]);
    const pageSize = table.pagination.pageSize;
    const pagedRows = matchedRows.slice((page - 1) * pageSize, page * pageSize);

    const runQuery = (values) => {
      setLoading(true);
      setFailure('');
      setDenied(false);
      setPage(1);
      window.setTimeout(() => {
        const valuesList = Object.values(values || {}).map((value) => String(value || '').trim().toUpperCase());
        if (valuesList.includes('ERROR')) {
          setFailure('服务暂时不可用，请稍后重试。');
          setLoading(false);
          return;
        }
        if (valuesList.includes('DENIED')) {
          setDenied(true);
          setLoading(false);
          return;
        }
        setFilters(values || {});
        setLoading(false);
      }, 220);
    };

    const reset = () => {
      queryForm.resetFields();
      setFilters({});
      setFailure('');
      setDenied(false);
      setPage(1);
    };

    const changeView = (key) => {
      if (queryTabs) {
        queryForm.resetFields();
        setFilters({});
        setFailure('');
        setDenied(false);
        setCollapsed(false);
      }
      setActiveView(key);
      setPage(1);
    };

    const closeCreate = () => {
      createForm.resetFields();
      setDirty(false);
      setCreating(false);
      setCreateOpen(false);
      setRowPageAction(null);
      setContextAction(null);
      setSelectedKeys([]);
      setView('list');
    };

    const requestLeaveCreate = () => {
      if (!dirty) {
        closeCreate();
        return;
      }
      Modal.confirm({
        title: '放弃未保存修改？',
        content: '返回后当前填写内容将不会保留。',
        okText: '放弃并返回',
        cancelText: '继续编辑',
        centered: true,
        onOk: closeCreate
      });
    };

    const createRecord = (values) => {
      const rowKey = table.rowKey;
      if (String(values.projectName || '').trim().toUpperCase() === 'ERROR') {
        createForm.setFields([{ name: 'projectName', errors: ['项目名称校验失败，请更换后重试'] }]);
        return;
      }
      if (allRows.some((row) => String(row[rowKey]) === String(values[rowKey]))) {
        const keyLabel = (createConfig?.groups || []).flatMap((group) => group.fields || []).find((field) => field.key === rowKey)?.label || rowKey;
        createForm.setFields([{ name: rowKey, errors: [`${keyLabel}已存在，请重新输入`] }]);
        return;
      }
      setCreating(true);
      window.setTimeout(() => {
        const record = normalizeRecord(values, createConfig?.recordDefaults, table);
        setAllRows((current) => [record, ...current]);
        setPage(1);
        setCreating(false);
        setDirty(false);
        setCreateOpen(false);
        setContextAction(null);
        setView('list');
        createForm.resetFields();
        message.success(createSubmit.successMessage || '新增成功');
      }, 320);
    };

    const updateRecord = (row, values, action) => {
      setCreating(true);
      window.setTimeout(() => {
        const next = normalizeRecord(values, row, table);
        setAllRows((current) => current.map((item) => String(item[table.rowKey]) === String(row[table.rowKey]) ? next : item));
        setCreating(false);
        setDirty(false);
        setContextAction(null);
        createForm.resetFields();
        message.success(action.form?.submit?.successMessage || action.successMessage || '修改成功');
      }, 320);
    };

    const updateRows = (keys, effect) => setAllRows((current) => current.map((row) => keys.includes(row[table.rowKey]) ? { ...row, [effect.field]: effect.value } : row));
    const deleteRows = (keys) => {
      setAllRows((current) => current.filter((row) => !keys.includes(row[table.rowKey])));
      setSelectedKeys([]);
    };
    const confirmAction = (action, rows, onOk) => {
      const confirm = action.confirm;
      if (!confirm) return onOk();
      Modal.confirm({
        title: confirm.title || `确认${action.label}？`,
        content: h('div', { className: 'ea-confirm-content' },
          h('p', null, confirm.description || '请确认该操作。'),
          confirm.impact ? h('p', { className: 'ea-confirm-impact' }, confirm.impact) : null,
          rows?.length > 1 ? h('p', { className: 'ea-confirm-impact' }, `将影响 ${rows.length} 条记录。`) : null
        ),
        okText: confirm.okText || '确认',
        cancelText: confirm.cancelText || '取消',
        okButtonProps: { danger: Boolean(action.danger || action.type === 'delete') },
        onOk
      });
    };
    const exportRows = () => {
      const columns = table.columns.filter((column) => column.key !== 'actions');
      const encode = (value) => `"${String(value && typeof value === 'object' ? value.text || value.minor || '' : value ?? '').replace(/"/g, '""')}"`;
      const csv = [columns.map((column) => encode(column.label)), ...matchedRows.map((row) => columns.map((column) => encode(row[column.key])))]
        .map((line) => line.join(',')).join('\n');
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' }));
      link.download = `${spec.metadata.pageName}.csv`;
      link.click();
      window.URL.revokeObjectURL(link.href);
      message.success('导出文件已生成');
    };

    const submitRowPageAction = () => {
      const submit = rowPageAction?.form?.submit || {};
      setCreating(true);
      window.setTimeout(() => {
        setCreating(false);
        setDirty(false);
        setRowPageAction(null);
        setView('list');
        createForm.resetFields();
        message.success(submit.successMessage || '提交成功');
      }, 320);
    };

    const onCreateFailed = ({ errorFields }) => {
      const first = errorFields?.[0]?.name?.[0];
      if (!first) return;
      createForm.scrollToField(first, { behavior: 'smooth', block: 'center' });
      window.setTimeout(() => document.getElementById(`form-${first}`)?.focus(), 180);
    };

    const openCreate = () => {
      setDirty(false);
      const presentation = primaryAction?.presentation || 'modal';
      if (presentation === 'page') setView('create');
      else if (presentation === 'drawer') {
        createForm.resetFields();
        setContextAction({ kind: 'create', action: primaryAction, form: createConfig });
      } else setCreateOpen(true);
    };

    const handleRowAction = (action, row) => {
      if (action.type === 'detail') {
        setDetailRow(row);
        return;
      }
      if (action.type === 'page-form') {
        createForm.resetFields();
        setDirty(false);
        setRowPageAction({ ...action, row });
        setView('row-page-form');
        return;
      }
      if (action.type === 'edit') {
        const initialValues = normalizeInitialValues(formFields(action.form), row);
        createForm.setFieldsValue(initialValues);
        setDirty(false);
        setContextAction({ kind: 'edit', action, row, form: action.form || {}, initialValues });
        return;
      }
      if (action.type === 'confirm-state-change') {
        confirmAction(action, [row], () => {
          updateRows([row[table.rowKey]], action.effect);
          message.success(action.confirm?.successMessage || `${action.label}成功`);
        });
        return;
      }
      if (action.type === 'delete') {
        confirmAction(action, [row], () => {
          deleteRows([row[table.rowKey]]);
          message.success(action.confirm?.successMessage || '删除成功');
        });
        return;
      }
      message.info(`${action.label}已触发`);
    };

    const reorderColumn = (sourceKey, targetKey) => {
      if (!sourceKey || sourceKey === targetKey) return;
      setColumnOrder((current) => {
        const next = current.filter((key) => key !== sourceKey);
        next.splice(Math.max(next.indexOf(targetKey), 0), 0, sourceKey);
        return next;
      });
    };
    const orderedColumns = columnOrder.map((key) => table.columns.find((column) => column.key === key)).filter(Boolean);
    const columnSettings = h('div', { className: 'ea-column-settings' },
      h('div', { className: 'ea-column-settings-header' }, h('strong', null, '列设置'), table.columnSettings?.allowOrder ? h(Button, {
        type: 'link',
        size: 'small',
        onClick: () => {
          setVisibleKeys(table.columns.filter((column) => column.hidden !== true).map((column) => column.key));
          setColumnOrder(table.columns.map((column) => column.key));
        }
      }, '恢复默认') : null),
      ...orderedColumns.filter((column) => column.key !== 'actions' && column.hideable !== false).map((column) => h('div', {
        key: column.key,
        className: 'ea-column-setting-row',
        draggable: Boolean(table.columnSettings?.allowOrder),
        onDragStart: () => setDraggingKey(column.key),
        onDragOver: (event) => event.preventDefault(),
        onDrop: () => { reorderColumn(draggingKey, column.key); setDraggingKey(''); }
      },
      table.columnSettings?.allowOrder ? h('span', { className: 'ea-column-drag-handle', 'aria-hidden': true }, '::') : null,
      h(Checkbox, {
        checked: visibleKeys.includes(column.key),
        onChange: (event) => setVisibleKeys((current) => event.target.checked ? [...new Set([...current, column.key])] : current.filter((key) => key !== column.key))
      }, column.label))));

    const dataColumns = orderedColumns
      .filter((column) => visibleKeys.includes(column.key) && (!denied || column.key !== 'actions'))
      .map((column) => {
        if (column.key === 'actions') return {
          key: column.key,
          title: column.label,
          width: column.width,
          className: 'ea-action-column',
          onCell: () => ({ className: 'ea-action-column' }),
          fixed: 'right',
          render: (_, row) => h(Space, { size: 12 }, ...((table.rowActions || column.actions || [])).map((action) => h(Button, {
            key: action.key,
            type: 'link',
            size: 'small',
            danger: Boolean(action.danger || action.type === 'delete'),
            onClick: () => handleRowAction(action, row)
          }, action.label)))
        };
        return {
          key: column.key,
          dataIndex: column.key,
          title: column.label,
          width: column.width,
          ellipsis: column.format !== 'stack',
          render: column.format === 'amount'
            ? amount
            : column.format === 'status'
              ? status
              : column.format === 'switch'
                ? (value, row) => h(Switch, {
                  checked: value === true || value === 'enabled' || value === 'active',
                  checkedChildren: column.enabledLabel || '启用',
                  unCheckedChildren: column.disabledLabel || '禁用',
                  onChange: (checked) => setAllRows((current) => current.map((item) => item[table.rowKey] === row[table.rowKey]
                    ? { ...item, [column.key]: checked ? 'enabled' : 'disabled' }
                    : item))
                })
              : column.format === 'stack'
                ? (_, row) => stackCell(column, row)
                : undefined
        };
      });

    const emptyText = failure
      ? h('div', { className: 'ea-table-state' }, h('strong', null, '查询失败'), h('span', null, failure), h(Button, { onClick: () => runQuery(queryForm.getFieldsValue()) }, '重新查询'))
      : denied
        ? h('div', { className: 'ea-table-state' }, h('strong', null, '暂无查询权限'), h('span', null, '请联系管理员开通当前项目范围的查询权限。'))
        : h(Empty, { description: '暂无匹配项目' });

    const drawer = table.drawerDetail ? h(Drawer, {
      open: Boolean(detailRow),
      title: table.drawerDetail.title,
      width: 720,
      className: 'ea-detail-drawer',
      closeIcon: false,
      onClose: () => setDetailRow(null),
      extra: h(Button, {
        type: 'text',
        icon: h(CloseOutlined),
        'aria-label': '关闭详情',
        onClick: () => setDetailRow(null)
      }),
      footer: h('div', { className: 'ea-drawer-footer-actions' },
        h(Button, { onClick: () => setDetailRow(null) }, table.drawerDetail.closeLabel || '关闭'))
    }, detailRow ? h('div', { className: 'ea-drawer-detail' }, ...(table.drawerDetail.groups || []).map((group) => {
      const detailTable = group.table;
      const detailColumns = (detailTable?.columns || []).map((column) => ({
        key: column.key,
        title: column.label,
        dataIndex: column.key,
        width: column.width,
        render: column.format ? (value) => displayValue(value, column) : undefined
      }));
      const detailRows = detailTable?.rowsSource ? detailRow[detailTable.rowsSource] || [] : detailTable?.rows || [];
      return h('section', { key: group.key, className: 'ea-drawer-detail-group' },
        h('h3', null, group.title),
        group.fields?.length ? h(Descriptions, {
          column: 2,
          size: 'small',
          items: (group.fields || []).map((field) => ({ key: field.key, label: field.label, children: detailValue(field, detailRow) }))
        }) : null,
        detailTable ? h(Table, { className: 'ea-detail-table', rowKey: detailTable.rowKey, columns: detailColumns, dataSource: detailRows, pagination: false, size: 'small', scroll: { x: detailTable.scrollX } }) : null
      );
    })) : null) : null;

    const modalFields = createConfig?.fields || [];
    const createModal = primaryAction && (primaryAction.presentation || 'modal') === 'modal' ? h(Modal, {
      open: createOpen,
      title: createConfig.title,
      centered: true,
      width: 640,
      className: 'ea-create-modal',
      styles: { body: { maxHeight: 'calc(80vh - 146px)', overflowY: 'auto' } },
      destroyOnClose: true,
      onCancel: requestLeaveCreate,
      footer: [
        h(Button, { key: 'cancel', disabled: creating, onClick: requestLeaveCreate }, createSubmit.secondaryLabel || '取消'),
        h(Button, { key: 'submit', type: 'primary', loading: creating, onClick: () => createForm.submit() }, createSubmit.primaryLabel)
      ]
    }, h(Form, {
      form: createForm,
      layout: 'vertical',
      onValuesChange: () => setDirty(true),
      onFinish: createRecord,
      onFinishFailed: onCreateFailed,
      className: 'ea-create-form'
    }, h('div', { className: 'ea-create-form-grid' }, ...modalFields.map((field) => h('div', { key: field.key }, formItem(field)))))) : null;

    const contextFormSpec = contextAction?.form || {};
    const contextFields = contextFormSpec.fields || (contextFormSpec.groups || []).flatMap((group) => group.fields || []);
    const contextInitialValues = normalizeInitialValues(contextFields, contextAction?.initialValues || contextAction?.row || contextFormSpec.initialValues);
    const contextDrawer = contextAction ? h(Drawer, {
      open: true,
      title: contextFormSpec.title || contextAction.action?.label,
      width: contextFormSpec.width || 640,
      closeIcon: false,
      onClose: requestLeaveCreate,
      extra: h(Button, { type: 'text', icon: CloseOutlined ? h(CloseOutlined) : null, 'aria-label': '关闭表单', onClick: requestLeaveCreate }),
      footer: h('div', { className: 'ea-drawer-footer-actions' },
        h(Button, { disabled: creating, onClick: requestLeaveCreate }, contextFormSpec.submit?.secondaryLabel || '取消'),
        h(Button, { type: 'primary', loading: creating, onClick: () => createForm.submit() }, contextFormSpec.submit?.primaryLabel || (contextAction.kind === 'edit' ? '保存修改' : '保存'))
      )
    }, h(Form, {
      form: createForm,
      layout: 'vertical',
      initialValues: contextInitialValues,
      onValuesChange: () => setDirty(true),
      onFinish: (values) => contextAction.kind === 'edit' ? updateRecord(contextAction.row, values, contextAction.action) : createRecord(values),
      onFinishFailed: onCreateFailed,
      className: 'ea-context-form'
    }, h('div', { className: 'ea-create-form-grid' }, ...contextFields.map((field) => h('div', { key: field.key }, formItem(field)))))) : null;

    const pageFormConfig = view === 'row-page-form' ? rowPageAction?.form : createConfig;
    const pageFormSubmit = pageFormConfig?.submit || {};
    const pageFormInitialValues = normalizeInitialValues(formFields(pageFormConfig), pageFormConfig?.initialValues);
    const pageFormVisible = (view === 'create' && primaryAction?.presentation === 'page') || view === 'row-page-form';
    if (pageFormVisible && pageFormConfig) {
      return h('div', { className: 'ea-page-content ea-page-form' },
        h('div', { className: 'ea-page-form-heading' },
          h(Button, {
            type: 'text',
            className: 'ea-page-form-back',
            icon: h(ArrowLeftOutlined),
            disabled: creating,
            onClick: requestLeaveCreate
          }, pageFormConfig.backLabel || '返回'),
          h('h1', null, pageFormConfig.title)),
        h(Form, {
          form: createForm,
          name: 'project-create',
          layout: 'horizontal',
          labelAlign: 'left',
          colon: false,
          labelCol: { flex: '148px' },
          wrapperCol: { flex: '620px' },
          initialValues: pageFormInitialValues,
          onValuesChange: () => setDirty(true),
          onFinish: view === 'row-page-form' ? submitRowPageAction : createRecord,
          onFinishFailed: onCreateFailed,
          scrollToFirstError: true
        },
        h('div', { className: 'ea-page-form-groups' },
          ...(pageFormConfig.groups || []).map((group) => h('section', { key: group.key, className: 'ea-module ea-page-form-group', 'aria-labelledby': `group-${group.key}` },
            h('h2', { id: `group-${group.key}` }, group.title),
            group.description ? h('p', { className: 'ea-page-form-group-description' }, group.description) : null,
            ...(group.fields || []).map((field) => h(Form.Item, {
              key: field.key,
              label: field.label,
              name: field.key,
              rules: formRules(field),
              extra: field.help
            }, control(field, `form-${field.key}`)))))),
        h('div', { className: 'ea-page-form-sticky-actions' },
          h('div', { className: 'ea-page-form-action-inner' },
            h(Button, { disabled: creating, onClick: requestLeaveCreate }, pageFormSubmit.secondaryLabel || '取消'),
            h(Button, { type: 'primary', loading: creating, htmlType: 'submit' }, pageFormSubmit.primaryLabel)))));
    }

    const inlineSummary = spec.list.summary?.items?.length ? h('div', { className: 'ea-inline-summary' }, ...spec.list.summary.items.map((item) => h('span', { key: item.key }, item.label, h('strong', null, `${item.value}${item.unit || ''}`)))) : null;
    const statistics = spec.list.statistics?.items?.length ? h('div', { className: 'ea-statistics-grid' }, ...spec.list.statistics.items.map((item) => h('div', { key: item.key, className: 'ea-statistic-card' }, h(Statistic, { title: item.label, value: item.value, precision: item.precision, suffix: item.unit })))) : null;
    const batchToolbar = selectedKeys.length && table.batchActions?.length ? h('div', { className: 'ea-batch-toolbar' },
      h('span', null, `已选择 ${selectedKeys.length} 条`),
      ...table.batchActions.map((action) => h(Button, {
        key: action.key,
        type: action.primary ? 'primary' : 'default',
        danger: Boolean(action.danger || action.type === 'delete'),
        onClick: () => confirmAction(action, allRows.filter((row) => selectedKeys.includes(row[table.rowKey])), () => {
          if (action.type === 'delete') deleteRows(selectedKeys);
          else updateRows(selectedKeys, action.effect);
          message.success(action.confirm?.successMessage || `${action.label}成功`);
        })
      }, action.label))
    ) : null;
    const rowSelection = table.rowSelection ? { selectedRowKeys: selectedKeys, onChange: (keys) => setSelectedKeys(keys) } : undefined;
    const expandable = table.expandable ? {
      defaultExpandAllRows: false,
      expandedRowRender: (row) => {
        const childTable = table.expandable.childTable || {};
        const childColumns = (childTable.columns || []).map((column) => ({ key: column.key, title: column.label, dataIndex: column.key, width: column.width, render: column.format ? (value) => displayValue(value, column) : undefined }));
        return h(Table, { className: 'ea-child-table', rowKey: childTable.rowKey, columns: childColumns, dataSource: row[childTable.rowsSource] || [], pagination: false, size: 'small', scroll: { x: childTable.scrollX } });
      }
    } : undefined;

    return h('div', { className: 'ea-page-content ea-list-page' },
      h('section', { className: 'ea-module ea-query-module', 'aria-label': '查询条件' },
        queryTabs ? h(Tabs, {
          className: 'ea-query-tabs',
          activeKey: activeView,
          items: views.map((item) => ({
            key: item.key,
            label: item.count === undefined ? item.label : `${item.label}(${item.count})`
          })),
          onChange: changeView
        }) : null,
        h(Form, { form: queryForm, layout: 'vertical', onFinish: runQuery },
          h('div', { className: 'ea-query-grid' },
            ...visibleFields.map((field) => h(Form.Item, { key: field.key, label: field.label, name: field.key }, control(field, `field-${field.key}`))),
            h('div', { className: 'ea-query-actions' },
              h(Button, { onClick: reset }, '重置'),
              h(Button, { type: 'primary', htmlType: 'submit', loading }, '查询'),
              supportsCollapse ? h(Button, {
                type: 'link',
                className: 'ea-query-expand-button',
                onClick: () => setCollapsed((value) => !value)
              }, collapsed ? '展开' : '收起', collapsed ? h(DownOutlined) : h(UpOutlined)) : null))
        )),
      h('section', { className: 'ea-module ea-result-module', 'aria-label': table.sectionTitle || '列表结果' },
        statistics,
        h('div', { className: 'ea-result-toolbar' },
          views.length && !queryTabs ? h(Tabs, {
            activeKey: activeView,
            items: views.map((item) => ({
              key: item.key,
              label: item.count === undefined ? item.label : `${item.label}(${item.count})`
            })),
            onChange: changeView
          }) : h('div', { className: 'ea-result-title-group' }, h('h2', null, table.sectionTitle || '列表'), inlineSummary),
          denied ? null : h('div', { className: 'ea-result-actions' },
            primaryAction ? h(Button, { type: 'primary', onClick: openCreate }, primaryAction.label) : null,
            ...(table.secondaryActions || []).map((action) => h(Button, { key: action.key, onClick: () => action.type === 'export' ? exportRows() : message.info(`${action.label}已触发`) }, action.label)),
            (table.tools || []).includes('refresh') ? h(Tooltip, { key: 'refresh', title: '刷新' }, h(Button, { 'aria-label': '刷新', icon: ReloadOutlined ? h(ReloadOutlined) : null, onClick: () => runQuery(queryForm.getFieldsValue()) })) : null,
            (table.tools || []).includes('export') ? h(Tooltip, { key: 'export', title: '导出' }, h(Button, { 'aria-label': '导出', icon: DownloadOutlined ? h(DownloadOutlined) : null, onClick: exportRows })) : null,
            h(Popover, {
              open: settingsOpen,
              onOpenChange: setSettingsOpen,
              trigger: 'click',
              content: columnSettings,
              placement: 'bottomRight'
            }, h(Tooltip, { title: '列设置' }, h(Button, { 'aria-label': '列设置', icon: SettingOutlined ? h(SettingOutlined) : null }))))),
        batchToolbar,
        h(Table, {
          className: 'ea-table',
          rowKey: table.rowKey,
          columns: dataColumns,
          dataSource: failure || denied ? [] : pagedRows,
          loading,
          locale: { emptyText },
          pagination: false,
          scroll: { x: table.scrollX || 1080 },
          rowSelection,
          expandable
        }),
        h('div', { className: 'ea-pagination-row' }, h(Pagination, {
          current: page,
          pageSize,
          total: failure || denied ? 0 : matchedRows.length,
          showSizeChanger: false,
          showTotal: (total) => `共 ${total} 条`,
          onChange: setPage
        }))
      ),
      drawer,
      createModal,
      contextDrawer);
  }

  function formSuccess(spec, submit, form, onReset) {
    const success = submit.success || {};
    return h(Result, {
      status: success.status || 'success',
      title: success.title || submit.successTitle || '提交成功',
      subTitle: success.message || submit.successMessage || '提交内容已保存。',
      extra: h('div', { className: 'ea-result-extra' },
        h(ResultSummary, { summary: success.summary }),
        h(Space, { wrap: true },
          h(Button, { type: 'primary', onClick: onReset }, success.actionLabel || submit.againLabel || '继续新增'),
          success.secondaryAction ? h(Button, { onClick: () => message.info(success.secondaryAction.feedback || success.secondaryAction.label) }, success.secondaryAction.label) : null
        ),
        success.feedback ? h(ResultFeedback, { feedback: success.feedback }) : null
      )
    });
  }

  function WizardFormPage({ spec }) {
    const formSpec = spec.form || {};
    const [form] = Form.useForm();
    const [step, setStep] = React.useState(0);
    const [submitting, setSubmitting] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);
    const steps = formSpec.steps || [];
    const current = steps[step] || {};
    const allFields = steps.flatMap((item) => item.fields || []);
    const submit = formSpec.submit || {};
    const reset = () => { form.resetFields(); setStep(0); setSubmitted(false); };
    const next = async () => {
      const names = (current.fields || []).filter((field) => !field.disabled).map((field) => field.key);
      try {
        await form.validateFields(names);
        setStep((value) => Math.min(value + 1, steps.length - 1));
      } catch ({ errorFields }) {
        const first = errorFields?.[0]?.name?.[0];
        if (first) form.scrollToField(first, { behavior: 'smooth', block: 'center' });
      }
    };
    const finish = async () => {
      try {
        await form.validateFields();
      } catch ({ errorFields }) {
        const first = errorFields?.[0]?.name?.[0];
        if (first) form.scrollToField(first, { behavior: 'smooth', block: 'center' });
        return;
      }
      setSubmitting(true);
      window.setTimeout(() => { setSubmitting(false); setSubmitted(true); message.success(submit.success?.message || submit.successMessage || '提交成功'); }, submit.delayMs || 320);
    };
    if (submitted) return h('div', { className: 'ea-page-content ea-page-form' }, h('section', { className: 'ea-module ea-page-form-result', 'aria-label': '提交结果' }, formSuccess(spec, submit, form, reset)));
    const reviewItems = allFields.map((field) => ({ key: field.key, label: field.label, children: field.control === 'upload' ? `${(form.getFieldValue(field.key) || []).length} 个文件` : displayValue(form.getFieldValue(field.key), field) }));
    const previewTable = current.previewTable;
    const previewColumns = (previewTable?.columns || []).map((column) => ({ key: column.key, title: column.label, dataIndex: column.key, width: column.width, render: column.format ? (value) => displayValue(value, column) : undefined }));
    return h('div', { className: 'ea-page-content ea-page-form ea-wizard-page' },
      h('section', { className: 'ea-module ea-page-form-heading-module' }, h('div', { className: 'ea-page-form-heading' }, h('h1', null, spec.metadata.pageName))),
      h('section', { className: 'ea-module ea-wizard-module' },
        h(Steps, { current: step, items: steps.map((item) => ({ title: item.title, description: item.description })), className: 'ea-wizard-steps' }),
        h(Form, { form, layout: 'vertical', className: 'ea-page-form-main', initialValues: normalizeInitialValues(formFields(formSpec), formSpec.initialValues) },
          current.review
            ? previewTable
              ? h(Table, { className: 'ea-wizard-review-table', rowKey: previewTable.rowKey, columns: previewColumns, dataSource: previewTable.rows || [], pagination: false, size: 'small', scroll: { x: previewTable.scrollX } })
              : h(Descriptions, { className: 'ea-wizard-review', column: 2, size: 'small', items: reviewItems })
            : h('div', { className: 'ea-page-form-field-grid' }, ...(current.fields || []).map(formItem))
        )
      ),
      h('div', { className: 'ea-page-form-sticky-actions' }, h('div', { className: 'ea-page-form-action-inner' },
        h(Button, { disabled: step === 0 || submitting, onClick: () => setStep((value) => Math.max(value - 1, 0)) }, '上一步'),
        step < steps.length - 1
          ? h(Button, { type: 'primary', disabled: submitting, onClick: next }, '下一步')
          : h(Button, { type: 'primary', loading: submitting, onClick: finish }, submit.primaryLabel || '提交')
      ))
    );
  }

  function FormPage({ spec }) {
    const formSpec = spec.form || {};
    if (Array.isArray(formSpec.steps)) return h(WizardFormPage, { spec });
    const [form] = Form.useForm();
    const [dirty, setDirty] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);
    const submit = formSpec.submit || {};
    const presentation = formSpec.presentation || 'page';
    const sections = Array.isArray(formSpec.groups) ? formSpec.groups : [{ key: 'main', title: formSpec.sectionTitle, fields: formSpec.fields || [] }];

    const reset = () => { form.resetFields(); setDirty(false); setSubmitted(false); };
    const leave = () => {
      if (!dirty) return reset();
      Modal.confirm({
        title: '放弃未保存修改？',
        content: '返回后当前填写内容将不会保留。',
        okText: '放弃并返回',
        cancelText: '继续编辑',
        centered: true,
        onOk: reset
      });
    };
    const finish = (values) => {
      const failure = submit.failure;
      const failureMatched = failure?.trigger && values[failure.trigger.field] === failure.trigger.value;
      if (failureMatched || String(values.accountName || '').trim().toUpperCase() === 'ERROR') {
        const key = failure?.trigger?.field || 'accountName';
        form.setFields([{ name: key, errors: [failure?.message || '账户名称校验失败，请更换后重试'] }]);
        return;
      }
      setSubmitting(true);
      window.setTimeout(() => {
        setSubmitting(false);
        setDirty(false);
        setSubmitted(true);
        message.success(submit.success?.message || submit.successMessage || '提交成功');
      }, submit.delayMs || 320);
    };
    const onFailed = ({ errorFields }) => {
      const first = errorFields?.[0]?.name?.[0];
      if (!first) return;
      form.scrollToField(first, { behavior: 'smooth', block: 'center' });
      window.setTimeout(() => document.getElementById(`form-${first}`)?.focus(), 180);
    };
    const body = submitted
      ? h('section', { className: 'ea-module ea-page-form-result', 'aria-label': '提交结果' }, formSuccess(spec, submit, form, reset))
      : h(Form, {
        form,
        layout: 'vertical',
        initialValues: normalizeInitialValues(formFields(formSpec), formSpec.initialValues),
        onValuesChange: () => setDirty(true),
        onFinish: finish,
        onFinishFailed: onFailed,
        scrollToFirstError: true,
        className: 'ea-page-form-main'
      },
      h('div', { className: 'ea-page-form-groups' },
        ...sections.map((group) => h('section', { key: group.key, className: presentation === 'page' ? 'ea-module ea-page-form-group' : 'ea-context-form-group', 'aria-labelledby': `group-${group.key}` },
          group.title ? h('h2', { id: `group-${group.key}` }, group.title) : null,
          group.description ? h('p', { className: 'ea-page-form-group-description' }, group.description) : null,
          h('div', { className: 'ea-page-form-field-grid' }, ...(group.fields || []).map((field) => h('div', { key: field.key, className: field.span === 2 ? 'ea-form-field-span-2' : '' }, formItem(field))))
        ))
      ),
      presentation === 'page' ? formSpec.stickyActions !== false ? h('div', { className: 'ea-page-form-sticky-actions' }, h('div', { className: 'ea-page-form-action-inner' },
        h(Button, { disabled: submitting, onClick: leave }, submit.secondaryLabel || '取消'),
        h(Button, { type: 'primary', loading: submitting, htmlType: 'submit' }, submit.primaryLabel || '提交')
      )) : h('div', { className: 'ea-page-form-inline-actions' },
        h(Button, { disabled: submitting, onClick: leave }, submit.secondaryLabel || '取消'),
        h(Button, { type: 'primary', loading: submitting, htmlType: 'submit' }, submit.primaryLabel || '提交')
      ) : null);
    const contextActions = [
      h(Button, { key: 'cancel', disabled: submitting, onClick: leave }, submit.secondaryLabel || '取消'),
      h(Button, { key: 'submit', type: 'primary', loading: submitting, onClick: () => form.submit() }, submit.primaryLabel || '提交')
    ];
    if (presentation === 'modal') return h('div', { className: 'ea-page-content' }, h(Modal, {
      open: true,
      title: spec.metadata.pageName,
      centered: true,
      width: formSpec.width || 640,
      destroyOnClose: false,
      onCancel: leave,
      footer: submitted ? null : contextActions
    }, body));
    if (presentation === 'drawer') return h('div', { className: 'ea-page-content' }, h(Drawer, {
      open: true,
      title: spec.metadata.pageName,
      width: formSpec.width || 640,
      closeIcon: false,
      onClose: leave,
      extra: h(Button, { type: 'text', icon: CloseOutlined ? h(CloseOutlined) : null, 'aria-label': '关闭表单', onClick: leave }),
      footer: submitted ? null : h('div', { className: 'ea-drawer-footer-actions' }, ...contextActions)
    }, body));
    return h('div', { className: 'ea-page-content ea-page-form' },
      submitted ? body : h(React.Fragment, null,
        h('section', { className: 'ea-module ea-page-form-heading-module' }, h('div', { className: 'ea-page-form-heading' },
          h('h1', null, spec.metadata.pageName),
          formSpec.description ? h('p', { className: 'ea-page-form-description' }, formSpec.description) : null
        )),
        formSpec.sideGuide ? h('div', { className: 'ea-guided-form-layout' }, h('div', { className: 'ea-guided-form-main' }, body), h('aside', { className: 'ea-form-side-guide' }, h('h2', null, formSpec.sideGuide.title), h('p', null, formSpec.sideGuide.text))) : body
      )
    );
  }

  function DetailGroup({ group }) {
    const items = (group.fields || []).map((field) => ({
      key: field.key,
      label: field.label,
      span: field.span || 1,
      children: displayValue(field.value, field)
    }));
    const table = group.table;
    const columns = (table?.columns || []).map((column) => ({
      key: column.key,
      title: column.label,
      dataIndex: column.key,
      width: column.width,
      ellipsis: column.ellipsis !== false,
      render: column.format ? (value) => displayValue(value, column) : undefined
    }));
    return h('section', { id: `detail-${group.key}`, className: 'ea-module ea-detail-section', 'aria-labelledby': `detail-title-${group.key}` },
      h('h2', { id: `detail-title-${group.key}` }, group.title),
      group.description ? h('p', { className: 'ea-detail-description' }, group.description) : null,
      items.length ? h(Descriptions, { column: group.columns || 3, size: 'small', items }) : null,
      table ? h(Table, { className: 'ea-detail-table', rowKey: table.rowKey, columns, dataSource: table.rows || [], pagination: false, size: 'small', scroll: { x: table.scrollX } }) : null
    );
  }

  function ResultSummary({ summary }) {
    const items = summary?.items || [];
    if (!items.length) return null;
    return h('div', { className: 'ea-result-summary' }, ...items.map((item) => h('div', { key: item.key, className: 'ea-result-summary-item' },
      h('span', { className: 'ea-result-summary-label' }, item.label),
      h('span', { className: 'ea-result-summary-value' }, `${item.value}${item.unit || ''}`)
    )));
  }

  function ResultFeedback({ feedback }) {
    const [selected, setSelected] = React.useState('');
    const options = feedback?.options || ['不满意', '一般', '满意'].map((label) => ({ key: label, label }));
    return h('div', { className: 'ea-result-feedback' },
      h('p', null, feedback?.question || '本次操作体验如何？'),
      h(Space, { wrap: true }, ...options.map((option) => h(Button, {
        key: option.key || option.label,
        type: selected === (option.key || option.label) ? 'primary' : 'default',
        onClick: () => { setSelected(option.key || option.label); message.success('感谢您的反馈'); }
      }, option.label)))
    );
  }

  function DetailPage({ spec }) {
    const detail = spec.detail || {};
    const [open, setOpen] = React.useState(true);
    const groups = detail.groups || [];
    const renderGroup = (group) => h(DetailGroup, { key: group.key, group });
    const groupedContent = detail.tabs?.length
      ? h(Tabs, { className: 'ea-detail-tabs', items: detail.tabs.map((tab) => ({
        key: tab.key,
        label: tab.label,
        children: (tab.groupKeys || []).map((key) => groups.find((group) => group.key === key)).filter(Boolean).map(renderGroup)
      })) })
      : groups.map(renderGroup);
    const body = h('div', { className: 'ea-detail-body' },
      detail.metrics?.length ? h('section', { className: 'ea-detail-metrics', style: { '--ea-detail-metric-columns': Math.min(detail.metrics.length, 4) } }, ...detail.metrics.map((metric) => h('div', { key: metric.key, className: 'ea-detail-metric' }, h(Statistic, { title: metric.label, value: metric.value, precision: metric.precision, suffix: metric.unit })))) : null,
      detail.anchors && !detail.tabs ? h('div', { className: 'ea-detail-with-anchors' },
        h('nav', { className: 'ea-detail-anchors', 'aria-label': '详情目录' }, ...groups.map((group) => h('a', { key: group.key, href: `#detail-${group.key}` }, group.title))),
        h('div', { className: 'ea-detail-anchor-content' }, groupedContent)
      ) : groupedContent
    );
    const close = () => setOpen(false);
    if (detail.presentation === 'modal') return h('div', { className: 'ea-page-content' }, h(Modal, {
      open,
      title: spec.metadata.pageName,
      width: detail.width || 720,
      onCancel: close,
      footer: h(Button, { onClick: close }, detail.closeLabel || '关闭')
    }, body));
    if (detail.presentation === 'drawer') return h('div', { className: 'ea-page-content' }, h(Drawer, {
      open,
      title: spec.metadata.pageName,
      width: detail.width || 760,
      closeIcon: false,
      onClose: close,
      extra: h(Button, { type: 'text', icon: CloseOutlined ? h(CloseOutlined) : null, 'aria-label': '关闭详情', onClick: close }),
      footer: h('div', { className: 'ea-drawer-footer-actions' }, h(Button, { onClick: close }, detail.closeLabel || '我知道了'))
    }, body));
    return h('div', { className: 'ea-page-content ea-detail-page' }, body);
  }

  function ResultPage({ spec }) {
    const result = spec.result || {};
    const actions = result.actions || [];
    return h('div', { className: 'ea-page-content ea-result-page' },
      h('section', { className: 'ea-module ea-result-surface', 'aria-label': '操作结果' },
        h(Result, {
          status: result.status || 'success',
          title: result.title || '操作完成',
          subTitle: result.description,
          extra: h('div', { className: 'ea-result-extra' },
            h(ResultSummary, { summary: result.summary }),
            actions.length ? h(Space, { wrap: true }, ...actions.map((action, index) => h(Button, {
              key: action.key || action.label,
              type: index === 0 ? 'primary' : 'default',
              onClick: () => message.info(action.feedback || action.label)
            }, action.label))) : null,
            result.feedback ? h(ResultFeedback, { feedback: result.feedback }) : null
          )
        })
      )
    );
  }

  function Page({ spec }) {
    if (spec.metadata.family === 'list') return h(ListPage, { spec });
    if (spec.metadata.family === 'form') return h(FormPage, { spec });
    if (spec.metadata.family === 'detail') return h(DetailPage, { spec });
    if (spec.metadata.family === 'result') return h(ResultPage, { spec });
    return h('div', { className: 'ea-page-content' }, h(Empty, { description: '当前页面族尚未接入 Ant Design Page Spec 运行时' }));
  }

  window.EasyAccountPageSpecRuntime = {
    mount(spec, target) {
      if (!target) throw new Error('EasyAccountPageSpecRuntime: target element not found.');
      ReactDOM.render(h(ConfigProvider, {
        theme: {
          token: { colorPrimary: '#1E75FF', borderRadius: 4 },
          components: { Button: { borderRadius: 6 } }
        }
      }, h(Page, { spec })), target);
    }
  };
}());
