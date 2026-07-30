(function installBossLedgerPageSpecRuntime(global) {
  const React = global.React;
  const ReactDOM = global.ReactDOM;
  const antd = global.antd;
  const icons = global.icons || global.antdIcons || global.AntDesignIcons || {};
  const Charts = global.Charts || {};
  const h = React.createElement;
  const theme = global.BossLedgerTheme;
  if (!theme?.antTokens) throw new Error('Boss Ledger generated theme is missing. Rebuild Director artifacts before rendering.');

  const {
    App: AntApp,
    Alert,
    Badge,
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
    Spin,
    Statistic,
    Steps,
    Switch,
    Table,
    Tabs,
    Tooltip,
    Upload,
    message
  } = antd;

  const {
    DownOutlined,
    CloseOutlined,
    ReloadOutlined,
    SettingOutlined,
    UploadOutlined,
    UpOutlined
  } = icons;

  function defaultShellConfig(spec) {
    const pageName = spec.metadata.pageName;
    const pageKey = 'page-spec-current';
    const shell = spec.shell || {};
    const primaryKey = shell.activePrimaryKey || 'workspace';
    return {
      topbar: shell.topbar || {
        left: '上次登录时间：2026-07-28 09:18:32　登录 IP：10.24.18.66',
        right: 'Boss Ledger　帮助中心　消息'
      },
      logoSrc: './assets/boss-logo.svg',
      primaryNav: shell.primaryNav || [
        { key: 'home', label: '首页', route: '/home' },
        { key: 'merchant', label: '商户管理', route: '/merchant' },
        { key: 'workspace', label: '业务管理', route: '/workspace' },
        { key: 'system', label: '系统管理', route: '/system' }
      ],
      sideMenusByPrimary: shell.sideMenusByPrimary || {
        home: [{ key: 'home-group', label: '首页', icon: 'HomeOutlined', children: [{ key: 'dashboard', label: '经营概览', route: '/home/dashboard' }] }],
        merchant: [{ key: 'merchant-group', label: '商户管理', icon: 'TeamOutlined', children: [{ key: pageKey, label: pageName, route: `/merchant/${pageKey}`, closable: false }] }],
        workspace: [{ key: 'business-group', label: '业务管理', icon: 'AppstoreOutlined', children: [{ key: pageKey, label: pageName, route: `/workspace/${pageKey}`, closable: false }] }],
        system: [{ key: 'system-group', label: '系统管理', icon: 'SettingOutlined', children: [{ key: pageKey, label: pageName, route: `/system/${pageKey}`, closable: false }] }]
      },
      tabs: shell.tabs || [{ key: pageKey, label: pageName, route: `/${primaryKey}/${pageKey}`, closable: false }],
      activePrimaryKey: primaryKey,
      selectedMenuKey: shell.selectedMenuKey || pageKey,
      openMenuKeys: shell.openMenuKeys || [`${primaryKey === 'workspace' ? 'business' : primaryKey}-group`],
      activeTabKey: shell.activeTabKey || pageKey,
      footerText: shell.footerText
    };
  }

  function normalizeOptions(options) {
    return (options || []).map((option) => ({ label: option.label, value: option.value }));
  }

  function controlForField(field) {
    const common = { placeholder: field.placeholder || (['select', 'radio'].includes(field.control) ? `请选择${field.label}` : `请输入${field.label}`) };
    if (field.control === 'select') return h(Select, { ...common, allowClear: true, options: normalizeOptions(field.options) });
    if (field.control === 'date') return h(DatePicker, { style: { width: '100%' }, placeholder: field.placeholder || `请选择${field.label}` });
    if (field.control === 'date-range') return h(DatePicker.RangePicker, { style: { width: '100%' }, placeholder: ['开始日期', '结束日期'] });
    if (field.control === 'number') return h(InputNumber, { ...common, style: { width: '100%' }, min: field.min, max: field.max, precision: field.precision });
    if (field.control === 'textarea') return h(Input.TextArea, { ...common, rows: field.rows || 4, maxLength: field.maxLength, showCount: Boolean(field.maxLength) });
    if (field.control === 'radio') return h(Radio.Group, { options: normalizeOptions(field.options) });
    if (field.control === 'switch') return h(Switch, { checkedChildren: field.checkedLabel || '是', unCheckedChildren: field.uncheckedLabel || '否' });
    if (field.control === 'upload') return h(Upload, {
      accept: field.accept || '.xlsx',
      maxCount: field.maxCount || 1,
      beforeUpload: () => false,
      showUploadList: true
    }, h(Button, { icon: h(UploadOutlined) }, field.uploadLabel || '选择文件'));
    return h(Input, { ...common, maxLength: field.maxLength });
  }

  function formRules(field) {
    const rules = [];
    if (field.required) rules.push({ required: true, message: field.requiredMessage || `请填写${field.label}` });
    if (field.pattern) rules.push({ pattern: new RegExp(field.pattern), message: field.patternMessage || `${field.label}格式不正确` });
    if (field.minLength) rules.push({ min: field.minLength, message: `${field.label}至少${field.minLength}个字符` });
    if (field.maxLength) rules.push({ max: field.maxLength, message: `${field.label}最多${field.maxLength}个字符` });
    return rules;
  }

  function formItem(field, options) {
    return h('div', { key: field.key, className: field.span === 2 ? 'boss-form-span-2' : '' },
      h(Form.Item, {
        name: field.key,
        label: field.label,
        rules: formRules(field),
        valuePropName: field.control === 'switch' ? 'checked' : field.control === 'upload' ? 'fileList' : 'value',
        getValueFromEvent: field.control === 'upload' ? (event) => Array.isArray(event) ? event : event?.fileList : undefined,
        extra: field.help
      }, controlForField(field)));
  }

  function matchesQuery(row, field, value) {
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return true;
    const source = row[field.filterKey || field.key];
    if (field.control === 'date-range') {
      const sourceTime = Date.parse(source);
      if (Number.isNaN(sourceTime)) return false;
      const [start, end] = Array.isArray(value) ? value : [];
      const startTime = start?.startOf ? start.startOf('day').valueOf() : start ? Date.parse(start) : null;
      const endTime = end?.endOf ? end.endOf('day').valueOf() : end ? Date.parse(end) : null;
      if (startTime !== null && !Number.isNaN(startTime) && sourceTime < startTime) return false;
      if (endTime !== null && !Number.isNaN(endTime) && sourceTime > endTime) return false;
      return true;
    }
    if (field.control === 'select' || field.control === 'radio' || field.control === 'switch') return source === value;
    return String(source ?? '').toLowerCase().includes(String(value).toLowerCase());
  }

  function formatAmount(value, column) {
    const number = Number(value || 0).toLocaleString('zh-CN', {
      minimumFractionDigits: column.precision ?? 2,
      maximumFractionDigits: column.precision ?? 2
    });
    return `${number}${column.unit ? ` ${column.unit}` : ''}`;
  }

  function boundDetailValue(field, row) {
    const value = row?.[field.source];
    if (field.format === 'status') {
      const status = field.statusMap?.[value] || { label: String(value ?? '-'), status: 'default' };
      return h(Badge, { status: status.status || 'default', text: status.label });
    }
    if (field.format === 'amount') return formatAmount(value, field);
    return String(value ?? '-');
  }

  function WorkflowDrawer({ open, workflow, initialValues, onClose, onSave }) {
    const [drawerForm] = Form.useForm();
    React.useEffect(() => {
      if (open) drawerForm.setFieldsValue(initialValues || {});
    }, [drawerForm, initialValues, open]);
    const submit = async () => {
      const values = await drawerForm.validateFields();
      onSave(values);
      drawerForm.resetFields();
    };
    return h(Drawer, {
      open,
      title: workflow?.title,
      width: workflow?.width || 640,
      closeIcon: false,
      onClose,
      extra: React.createElement(Button, { type: 'text', icon: h(CloseOutlined), 'aria-label': '关闭表单', onClick: onClose }),
      footer: h('div', { className: 'boss-drawer-footer-actions' },
        h(Button, { onClick: onClose }, workflow?.cancelLabel || '取 消'),
        h(Button, { type: 'primary', onClick: submit }, workflow?.primaryLabel || '保 存'))
    }, h(Form, { form: drawerForm, layout: 'vertical' }, h('div', { className: 'boss-drawer-form-fields' }, ...(workflow?.fields || []).map((field) => formItem(field)))));
  }

  function dataColumns(columns) {
    return (columns || []).map((column) => {
      const resolved = { key: column.key, dataIndex: column.key, title: column.label, width: column.width, ellipsis: column.ellipsis !== false };
      if (column.format === 'amount') {
        resolved.align = 'right';
        resolved.render = (value) => formatAmount(value, column);
      }
      if (column.format === 'status') {
        resolved.render = (value) => {
          const status = column.statusMap?.[value] || { label: String(value ?? '-'), status: 'default' };
          return h(Badge, { status: status.status || 'default', text: status.label });
        };
      }
      return resolved;
    });
  }

  function ListPage({ spec }) {
    const list = spec.list;
    const tableSpec = list.table;
    const [form] = Form.useForm();
    const [applied, setApplied] = React.useState({});
    const [rows, setRows] = React.useState(() => tableSpec.rows);
    const [loading, setLoading] = React.useState(false);
    const [failed, setFailed] = React.useState(false);
    const [expanded, setExpanded] = React.useState(list.query.defaultExpanded !== false);
    const [page, setPage] = React.useState(tableSpec.pagination.page || 1);
    const [detailRow, setDetailRow] = React.useState(null);
    const [workflow, setWorkflow] = React.useState(null);
    const [selectedKeys, setSelectedKeys] = React.useState([]);
    const [draggingKey, setDraggingKey] = React.useState(null);
    const initialColumnKeys = tableSpec.columns.map((column) => column.key);
    const optionalColumns = tableSpec.columns.filter((column) => column.key !== 'actions' && column.hideable !== false);
    const [visibleKeys, setVisibleKeys] = React.useState(() => tableSpec.columns.filter((column) => column.hidden !== true).map((column) => column.key));
    const [columnOrder, setColumnOrder] = React.useState(initialColumnKeys);

    const queryFields = list.query.fields || [];
    const visibleQueryFields = expanded ? queryFields : queryFields.filter((field, index) => !field.advanced && index < (list.query.collapseThreshold || 6));
    const filteredRows = React.useMemo(() => rows.filter((row) => queryFields.every((field) => matchesQuery(row, field, applied[field.key]))), [applied, queryFields, rows]);
    const pageSize = tableSpec.pagination.pageSize;
    const pagedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

    const runQuery = (values) => {
      setLoading(true);
      setFailed(false);
      setPage(1);
      global.setTimeout(() => {
        const trigger = spec.states?.error?.trigger;
        setFailed(Boolean(trigger && values[trigger.field] === trigger.value));
        setApplied(values);
        setLoading(false);
      }, spec.states?.loading?.delayMs || 220);
    };
    const reset = () => {
      form.resetFields();
      setApplied({});
      setFailed(false);
      setPage(1);
      setSelectedKeys([]);
    };
    const updateRows = (keys, effect) => setRows((current) => current.map((row) => keys.includes(row[tableSpec.rowKey]) ? { ...row, [effect.field]: effect.value } : row));
    const confirmAction = (action, affectedRows, onOk) => {
      const confirm = action.confirm;
      if (!confirm) return onOk();
      Modal.confirm({
        className: 'boss-confirm-modal',
        title: confirm.title,
        content: h('div', { className: 'boss-confirm-content' },
          h('div', null, confirm.description),
          h('div', { className: 'boss-confirm-impact' }, confirm.impact),
          affectedRows?.length ? h('div', { className: 'boss-confirm-impact' }, `已选择 ${affectedRows.length} 条记录`) : null,
          confirm.reversible === false ? h('div', { className: 'boss-confirm-risk' }, '此操作不可撤销') : null),
        width: 416,
        okText: '确 定',
        cancelText: '取 消',
        okButtonProps: { className: 'boss-confirm-button' },
        onOk
      });
    };
    const exportRows = () => {
      const exportColumns = tableSpec.columns.filter((column) => column.key !== 'actions');
      const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
      const csv = [exportColumns.map((column) => escape(column.label)), ...filteredRows.map((row) => exportColumns.map((column) => escape(row[column.key])))]
        .map((line) => line.join(',')).join('\n');
      const link = global.document.createElement('a');
      link.href = global.URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' }));
      link.download = `${spec.metadata.pageName}.csv`;
      link.click();
      global.URL.revokeObjectURL(link.href);
      message.success('导出文件已生成');
    };
    const reorderColumn = (sourceKey, targetKey) => {
      if (!sourceKey || sourceKey === targetKey) return;
      setColumnOrder((current) => {
        const next = current.filter((key) => key !== sourceKey);
        next.splice(Math.max(next.indexOf(targetKey), 0), 0, sourceKey);
        return next;
      });
    };

    const orderedColumns = columnOrder.map((key) => tableSpec.columns.find((column) => column.key === key)).filter(Boolean);
    const columns = orderedColumns.filter((column) => visibleKeys.includes(column.key) || column.key === 'actions').map((column) => {
      if (column.key !== 'actions') return dataColumns([column])[0];
      return {
        key: column.key,
        dataIndex: column.key,
        title: column.label,
        width: column.width,
        fixed: 'right',
        ellipsis: false,
        render: (_, row) => h(Space, { size: 4 }, ...(tableSpec.rowActions || [])
          .filter((action) => !action.visibleWhen || row[action.visibleWhen.field] === action.visibleWhen.equals)
          .map((action) => h(Button, {
            key: action.key,
            type: 'link',
            size: 'small',
            danger: Boolean(action.danger),
            onClick: () => {
              if (action.type === 'detail') setDetailRow(row);
              else if (action.type === 'edit') setWorkflow({ kind: 'edit', action, row });
              else if (action.type === 'confirm-state-change') confirmAction(action, [row], () => {
                updateRows([row[tableSpec.rowKey]], action.effect);
                message.success(action.confirm.successMessage);
              });
              else if (action.confirm) confirmAction(action, [row], () => message.success(`${action.label}成功`));
              else message.success(`${action.label}：${row[tableSpec.rowKey]}`);
            }
          }, action.label)))
      };
    });

    const settingsContent = h('div', { className: 'boss-column-settings' },
      h('div', { className: 'boss-column-settings-header' },
        h('strong', null, '列设置'),
        h(Button, { type: 'link', size: 'small', onClick: () => { setVisibleKeys(tableSpec.columns.filter((column) => column.hidden !== true).map((column) => column.key)); setColumnOrder(initialColumnKeys); } }, '恢复默认')),
      h('div', { className: 'boss-column-settings-list' }, ...optionalColumns.map((column) => h('div', {
        key: column.key,
        className: 'boss-column-setting-row',
        draggable: Boolean(tableSpec.columnSettings?.allowOrder),
        onDragStart: () => setDraggingKey(column.key),
        onDragOver: (event) => event.preventDefault(),
        onDrop: () => { reorderColumn(draggingKey, column.key); setDraggingKey(null); }
      },
      tableSpec.columnSettings?.allowOrder ? h('span', { className: 'boss-column-drag-handle', 'aria-label': '拖拽排序' }, '::') : null,
      h(Checkbox, { checked: visibleKeys.includes(column.key), onChange: (event) => setVisibleKeys((current) => event.target.checked ? [...new Set(current.concat(column.key))] : current.filter((key) => key !== column.key)) }, column.label)))));

    const summary = list.summary?.items?.length ? h('div', { className: 'boss-result-summary-inline' }, ...list.summary.items.map((item) => h('span', { key: item.key }, `${item.label} `, h('strong', null, item.value), item.suffix || ''))) : h('div', { className: 'boss-result-title' }, tableSpec.sectionTitle || '查询结果');
    const statistics = list.statistics?.items?.length ? h('div', { className: 'boss-result-summary', style: { '--boss-summary-columns': list.statistics.items.length } }, ...list.statistics.items.map((item) => h('div', { key: item.key, className: 'boss-statistic-card' }, h(Statistic, { title: item.label, value: item.value, precision: item.precision, suffix: item.unit })))) : null;
    const toolbarTools = [];
    (tableSpec.secondaryActions || []).forEach((action) => toolbarTools.push(h(Button, { key: action.key, onClick: action.type === 'export' ? exportRows : () => message.success(`${action.label}操作已触发`) }, action.label)));
    if (tableSpec.primaryAction) toolbarTools.push(h(Button, { key: tableSpec.primaryAction.key, type: 'primary', onClick: () => setWorkflow({ kind: 'create', action: tableSpec.primaryAction, row: tableSpec.primaryAction.createRecord || {} }) }, tableSpec.primaryAction.label));
    if ((tableSpec.tools || []).includes('refresh')) toolbarTools.push(h(Tooltip, { key: 'refresh', title: '刷新' }, h(Button, { icon: h(ReloadOutlined), 'aria-label': '刷新', onClick: () => runQuery(form.getFieldsValue()) })));
    if ((tableSpec.tools || []).includes('settings')) toolbarTools.push(h(Popover, { key: 'settings', title: null, content: settingsContent, trigger: 'click', placement: 'bottomRight' }, h(Tooltip, { title: '列设置' }, h(Button, { icon: h(SettingOutlined), 'aria-label': '列设置' }))));
    const batchBar = selectedKeys.length ? h('div', { className: 'boss-batch-toolbar' }, h('span', null, `已选择 ${selectedKeys.length} 项`), ...(tableSpec.batchActions || []).map((action) => h(Button, { key: action.key, danger: Boolean(action.danger), onClick: () => confirmAction(action, selectedKeys, () => { updateRows(selectedKeys, action.effect); setSelectedKeys([]); message.success(action.confirm?.successMessage || `${action.label}成功`); }) }, action.label))) : null;
    const emptyText = failed ? h(Result, { className: 'boss-error-state', status: 'error', title: spec.states?.error?.title || '数据加载失败', subTitle: spec.states?.error?.description || '请检查查询条件后重试。', extra: h(Button, { type: 'primary', onClick: () => runQuery(form.getFieldsValue()) }, '重新加载') }) : h(Empty, { description: spec.states?.empty?.description || '未查询到符合条件的数据' });
    const detailSpec = tableSpec.drawerDetail;
    const detailDrawer = detailSpec ? h(Drawer, {
      open: Boolean(detailRow), title: detailSpec.title, width: detailSpec.width || 808, closeIcon: false, onClose: () => setDetailRow(null),
      extra: h(Button, { type: 'text', icon: h(CloseOutlined), 'aria-label': '关闭详情', onClick: () => setDetailRow(null) }),
      footer: h('div', { className: 'boss-drawer-footer-actions' }, h(Button, { onClick: () => setDetailRow(null) }, detailSpec.closeLabel))
    }, detailRow ? h('div', { className: 'boss-drawer-detail' }, ...detailSpec.groups.map((group) => h('div', { key: group.key, className: 'boss-detail-section' },
      h('div', { className: 'boss-section-title' }, group.title),
      group.fields ? h(Descriptions, { column: group.columns || 3, size: 'small', items: group.fields.map((field) => ({ key: field.key, label: field.label, span: field.span || 1, children: boundDetailValue(field, detailRow) })) }) : null,
      group.table ? h(Table, { rowKey: group.table.rowKey, columns: dataColumns(group.table.columns), dataSource: group.table.rowsSource ? detailRow[group.table.rowsSource] || [] : group.table.rows || [], pagination: false, size: 'small' }) : null))) : null) : null;
    const workflowDrawer = workflow ? h(WorkflowDrawer, {
      open: true,
      workflow: workflow.action.form,
      initialValues: workflow.row,
      onClose: () => setWorkflow(null),
      onSave: (values) => {
        if (workflow.kind === 'create') setRows((current) => [{ ...workflow.row, ...values }, ...current]);
        else setRows((current) => current.map((row) => row[tableSpec.rowKey] === workflow.row[tableSpec.rowKey] ? { ...row, ...values } : row));
        message.success(workflow.action.form.successMessage);
        setWorkflow(null);
      }
    }) : null;
    const tableProps = {
      rowKey: tableSpec.rowKey,
      columns,
      dataSource: failed ? [] : pagedRows,
      loading,
      pagination: false,
      scroll: tableSpec.scrollX ? { x: tableSpec.scrollX } : undefined,
      locale: { emptyText }
    };
    if (tableSpec.rowSelection) tableProps.rowSelection = { selectedRowKeys: selectedKeys, onChange: setSelectedKeys };
    if (tableSpec.expandable) {
      const child = tableSpec.expandable.childTable;
      tableProps.expandable = { expandedRowRender: (row) => h(Table, { className: 'boss-child-table', rowKey: child.rowKey, columns: dataColumns(child.columns), dataSource: row[child.rowsSource] || [], pagination: false, size: 'small' }) };
    }
    return h(React.Fragment, null,
      h('div', { className: 'boss-content-stack' },
        h('section', { className: 'boss-query-module', 'data-boss-query-grid': '3' }, h(Form, { form, layout: 'horizontal', onFinish: runQuery, initialValues: list.query.initialValues || {} }, h('div', { className: 'boss-query-grid' },
          ...visibleQueryFields.map((field) => h(Form.Item, { key: field.key, name: field.key, label: field.label }, controlForField(field))),
          h('div', { className: 'boss-query-actions' }, queryFields.length > (list.query.collapseThreshold || 6) || queryFields.some((field) => field.advanced) ? h(Button, { type: 'text', className: 'boss-query-expand-button', icon: expanded ? h(UpOutlined) : h(DownOutlined), onClick: () => setExpanded((value) => !value) }, expanded ? '收 起' : '展 开') : null, h(Button, { onClick: reset }, '重 置'), h(Button, { type: 'primary', htmlType: 'submit' }, '查 询'))))),
        h('section', { className: 'boss-result-module' }, statistics, h('div', { className: 'boss-result-toolbar' }, h('div', { className: 'boss-result-toolbar-left' }, summary), h('div', { className: 'boss-result-toolbar-right' }, ...toolbarTools)), batchBar, h('div', { className: 'boss-table-body' }, h(Table, tableProps)), h('div', { className: 'boss-table-pagination' }, h(Pagination, { current: page, pageSize, total: failed ? 0 : filteredRows.length, showSizeChanger: false, showTotal: (total) => `共 ${total} 条`, onChange: setPage })))),
      detailDrawer,
      workflowDrawer);
  }

  function WizardFormPage({ spec }) {
    const formSpec = spec.form;
    const wizardSteps = [...formSpec.steps];
    const [form] = Form.useForm();
    const [step, setStep] = React.useState(0);
    const [submitting, setSubmitting] = React.useState(false);
    const [completed, setCompleted] = React.useState(false);
    const [submitError, setSubmitError] = React.useState(null);
    const allFields = wizardSteps.flatMap((item) => item.fields || []);
    const initialValues = {};
    allFields.forEach((field) => { if (Object.hasOwn(field, 'default')) initialValues[field.key] = field.default; });
    const currentStep = wizardSteps[step];
    const currentFields = currentStep.fields || [];

    const next = async () => {
      await form.validateFields(currentFields.map((field) => field.key));
      setStep((value) => Math.min(value + 1, wizardSteps.length - 1));
    };
    const submit = async () => {
      await form.validateFields();
      const confirmation = formSpec.submit.confirm || {};
      Modal.confirm({
        className: 'boss-confirm-modal',
        title: confirmation.title || '提交确认',
        content: confirmation.description || '确认提交当前配置吗？提交后将进入后续流程。',
        width: 416,
        okText: '提 交',
        cancelText: '取 消',
        okButtonProps: { className: 'boss-confirm-button' },
        onOk: () => new Promise((resolveSubmit) => {
          const values = form.getFieldsValue(true);
          setSubmitError(null);
          setSubmitting(true);
          global.setTimeout(() => {
            const failure = formSpec.submit.failure;
            if (failure && values[failure.trigger.field] === failure.trigger.value) {
              setSubmitting(false);
              setSubmitError(failure);
              resolveSubmit();
              return;
            }
            setSubmitting(false);
            setCompleted(true);
            message.success(formSpec.submit.success.message);
            resolveSubmit();
          }, formSpec.submit.delayMs || 260);
        })
      });
    };

    if (completed) {
      const returnSource = formSpec.submit.success.actionType === 'return-source';
      return h('div', { className: 'boss-content-stack' }, h('section', { className: 'boss-result-page' }, h(Result, {
        status: 'success',
        title: formSpec.submit.success.title || '提交成功',
        subTitle: formSpec.submit.success.message,
        extra: h(Button, { type: 'primary', onClick: () => {
          if (returnSource) {
            message.info('已返回来源列表');
            return;
          }
          setCompleted(false); setSubmitError(null); form.resetFields(); setStep(0);
        } }, formSpec.submit.success.actionLabel || (returnSource ? '返回列表' : '继续新增'))
      })));
    }

    return h('div', { className: 'boss-wizard-page', 'data-boss-wizard-template': 'fixed' },
      h('div', { className: 'wizard-content-frame' },
        h(Steps, { current: step, items: wizardSteps.map((item) => ({ title: item.title, description: item.description })), className: 'boss-wizard-steps' }),
        h('div', { className: 'wizard-body-grid' },
          h('section', { className: 'wizard-form-pane' }, h(Form, { form, layout: 'vertical', initialValues },
            currentStep.review && currentStep.previewTable
              ? h(Table, { className: 'boss-wizard-preview-table', rowKey: currentStep.previewTable.rowKey, columns: dataColumns(currentStep.previewTable.columns), dataSource: currentStep.previewTable.rows || [], pagination: false, size: 'small' })
              : currentStep.review
                ? h(Descriptions, { column: 2, size: 'small', items: Object.entries(form.getFieldsValue(true)).map(([key, value]) => ({ key, label: allFields.find((field) => field.key === key)?.label || key, children: Array.isArray(value) ? `${value.length} 个文件` : String(value ?? '-') })) })
              : h('div', { className: 'wizard-field-grid' }, ...currentFields.map((field) => formItem(field))),
            submitError ? h(Alert, { className: 'boss-form-submit-error', type: 'error', showIcon: true, message: submitError.message, description: submitError.recovery }) : null)),
          h('aside', { className: 'wizard-guide-pane' },
            React.createElement('img', { className: 'wizard-guide-image', src: './assets/wizard-guide.png', alt: formSpec.wizardGuide.alt || '流程引导' }),
            h('div', { className: 'wizard-guide-title' }, formSpec.wizardGuide.title),
            h('div', { className: 'wizard-guide-text' }, formSpec.wizardGuide.text)))),
      h('div', { className: 'wizard-action-bar' },
        h(Button, { disabled: step === 0, onClick: () => setStep((value) => Math.max(value - 1, 0)) }, '上一步'),
        step < wizardSteps.length - 1
          ? h(Button, { type: 'primary', onClick: next }, '下一步')
          : h(Button, { type: 'primary', loading: submitting, onClick: submit }, formSpec.submit.primaryLabel || '提 交')));
  }

  function FormPage({ spec }) {
    const formSpec = spec.form;
    if (formSpec.steps) return h(WizardFormPage, { spec });
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = React.useState(false);
    const [completed, setCompleted] = React.useState(false);
    const [submitError, setSubmitError] = React.useState(null);
    const sections = formSpec.groups || [{ key: 'main', title: formSpec.sectionTitle, fields: formSpec.fields }];
    const initialValues = {};
    const allFields = formSpec.fields || (formSpec.groups ? formSpec.groups.flatMap((group) => group.fields || []) : []);
    allFields.forEach((field) => { if (Object.hasOwn(field, 'default')) initialValues[field.key] = field.default; });
    const submit = async () => {
      const values = await form.validateFields();
      setSubmitError(null);
      setSubmitting(true);
      global.setTimeout(() => {
        const failure = formSpec.submit.failure;
        if (failure && values[failure.trigger.field] === failure.trigger.value) {
          setSubmitting(false);
          setSubmitError(failure);
          return;
        }
        setSubmitting(false);
        setCompleted(true);
        message.success(formSpec.submit.success.message);
      }, formSpec.submit.delayMs || 260);
    };

    const closeOrReset = () => { setCompleted(false); setSubmitError(null); form.resetFields(); };
    const presentation = formSpec.presentation || 'page';
    const pageActions = h('div', { className: `boss-form-actions ${presentation === 'page' ? 'boss-full-page-action-bar' : formSpec.stickyActions ? 'is-sticky' : ''}`, 'data-boss-full-page-action-bar': presentation === 'page' ? true : undefined }, h(Button, { onClick: () => form.resetFields() }, formSpec.submit.cancelLabel || '取 消'), h(Button, { type: 'primary', loading: submitting, onClick: submit }, formSpec.submit.primaryLabel));
    const floatingActions = [h(Button, { key: 'secondary', onClick: closeOrReset }, formSpec.submit.cancelLabel || '取 消'), h(Button, { key: 'submit', type: 'primary', loading: submitting, onClick: submit }, formSpec.submit.primaryLabel)];
    const formBody = completed
      ? h(Result, { status: 'success', title: formSpec.submit.success.title || '提交成功', subTitle: formSpec.submit.success.message, extra: h(Button, { type: 'primary', onClick: closeOrReset }, formSpec.submit.success.actionLabel || '返回填写') })
      : h(Form, { form, layout: presentation === 'modal' ? 'horizontal' : 'vertical', labelCol: presentation === 'modal' ? { flex: '104px' } : undefined, initialValues, className: presentation === 'modal' ? 'boss-modal-form' : undefined },
        ...(sections || []).map((section) => h('div', { key: section.key, className: 'boss-form-section' }, section.title ? h('div', { className: 'boss-section-title' }, section.title) : null, h('div', { className: 'boss-form-grid' }, ...(section.fields || []).map((field) => formItem(field))))),
        submitError ? h(Alert, { className: 'boss-form-submit-error', type: 'error', showIcon: true, message: submitError.message, description: submitError.recovery }) : null,
        presentation === 'page' ? pageActions : null);
    if (presentation === 'modal') return h('div', { className: 'boss-content-stack' }, h(Modal, { open: true, title: spec.metadata.pageName, width: formSpec.width || 500, closable: true, onCancel: closeOrReset, footer: completed ? null : floatingActions }, formBody));
    if (presentation === 'drawer') return h('div', { className: 'boss-content-stack' }, h(Drawer, { open: true, title: spec.metadata.pageName, width: formSpec.width || 640, closeIcon: false, onClose: closeOrReset, extra: React.createElement(Button, { type: 'text', icon: h(CloseOutlined), 'aria-label': '关闭表单', onClick: closeOrReset }), footer: completed ? null : h('div', { className: 'boss-drawer-footer-actions' }, ...floatingActions) }, formBody));
    return h('div', { className: 'boss-content-stack' }, h('section', { className: 'boss-form-module boss-full-page-form' }, h('h2', { className: 'boss-form-title' }, spec.metadata.pageName), formSpec.sideGuide ? h('div', { className: 'boss-guided-form-layout' }, h('div', { className: 'boss-guided-form-main' }, formBody), h('aside', { className: 'boss-form-side-guide' }, h('div', { className: 'boss-form-side-guide-title' }, formSpec.sideGuide.title), h('div', { className: 'boss-form-side-guide-text' }, formSpec.sideGuide.text))) : formBody));
  }

  function detailItems(fields) {
    return (fields || []).map((field) => ({
      key: field.key,
      label: field.label,
      span: field.span || 1,
      children: field.format === 'status'
        ? h(Badge, { status: field.status || 'default', text: field.value })
        : field.format === 'amount'
          ? formatAmount(field.value, field)
          : String(field.value ?? '-')
    }));
  }

  function DetailPage({ spec }) {
    const detail = spec.detail;
    const [open, setOpen] = React.useState(true);
    const groupView = (group) => h('div', { key: group.key, id: `detail-${group.key}`, className: 'boss-detail-section' },
      h('div', { className: 'boss-section-title' }, group.title),
      group.fields ? h(Descriptions, { column: group.columns || 3, size: 'small', items: detailItems(group.fields) }) : null,
      group.table ? h(Table, { rowKey: group.table.rowKey, columns: dataColumns(group.table.columns), dataSource: group.table.rows, pagination: false, size: 'small' }) : null);
    const groupedContent = detail.tabs ? h(Tabs, { items: detail.tabs.map((tab) => ({ key: tab.key, label: tab.label, children: tab.groupKeys.map((key) => groupView(detail.groups.find((group) => group.key === key))) })) }) : detail.groups.map(groupView);
    const body = h(React.Fragment, null,
      detail.metrics?.length ? h('div', { className: 'boss-detail-metrics', style: { '--boss-metric-columns': detail.metrics.length } }, ...detail.metrics.map((metric) => h('div', { key: metric.key, className: 'boss-detail-metric' }, h(Statistic, { title: metric.label, value: metric.value, suffix: metric.unit, precision: metric.precision })))) : null,
      detail.anchors ? h('div', { className: 'boss-detail-with-anchors' }, h('nav', { className: 'boss-detail-anchors', 'aria-label': '详情目录' }, ...detail.groups.map((group) => h('a', { key: group.key, href: `#detail-${group.key}` }, group.title))), h('div', { className: 'boss-detail-anchor-content' }, groupedContent)) : groupedContent);
    if (detail.presentation === 'modal') return h('div', { className: 'boss-content-stack' }, h(Modal, { open, title: spec.metadata.pageName, onCancel: () => setOpen(false), footer: h(Button, { onClick: () => setOpen(false) }, detail.closeLabel || '关 闭'), width: detail.width || 640 }, body));
    if (detail.presentation === 'drawer') return h('div', { className: 'boss-content-stack' }, h(Drawer, { open, title: spec.metadata.pageName, width: detail.width || 808, closeIcon: false, onClose: () => setOpen(false), extra: React.createElement(Button, { type: 'text', icon: h(CloseOutlined), 'aria-label': '关闭详情', onClick: () => setOpen(false) }), footer: h('div', { className: 'boss-drawer-footer-actions' }, h(Button, { onClick: () => setOpen(false) }, detail.closeLabel || '我知道了')) }, body));
    return h('div', { className: 'boss-content-stack' }, h('section', { className: 'boss-detail-module' }, h('h2', { className: 'boss-detail-title' }, spec.metadata.pageName), body));
  }

  function ResultPage({ spec }) {
    const result = spec.result;
    return h('div', { className: 'boss-content-stack' }, h('section', { className: 'boss-result-page' }, h(Result, {
      status: result.status,
      title: result.title,
      subTitle: result.description,
      extra: h(Space, null, ...result.actions.map((action, index) => h(Button, { key: action.key, type: index === 0 ? 'primary' : 'default', onClick: () => message.info(action.feedback || action.label) }, action.label)))
    })));
  }

  function DashboardChart({ chart }) {
    const ChartComponent = {
      line: Charts.Line,
      column: Charts.Column,
      pie: Charts.Pie,
      bar: Charts.Bar
    }[chart.type];
    const shared = {
      data: chart.data,
      autoFit: true,
      height: chart.height || 260,
      animation: false,
      tooltip: { shared: chart.type !== 'pie' },
      legend: chart.legend === false ? false : { position: 'bottom' }
    };
    let config = shared;
    if (chart.type === 'pie') {
      config = { ...shared, angleField: chart.angleField, colorField: chart.colorField, radius: 0.82, innerRadius: 0.58, label: false };
    } else {
      config = { ...shared, xField: chart.xField, yField: chart.yField, seriesField: chart.seriesField };
    }
    return h('section', { className: `boss-dashboard-chart boss-dashboard-chart-${chart.role}`, 'aria-label': chart.title },
      h('h3', { className: 'boss-dashboard-chart-title' }, chart.title),
      ChartComponent ? h(ChartComponent, config) : h(Empty, { description: '图表组件未加载' }));
  }

  function DashboardPage({ spec }) {
    const dashboard = spec.dashboard;
    const [form] = Form.useForm();
    const [scope, setScope] = React.useState(dashboard.scope.initialValues || {});
    const applyScope = (values) => {
      setScope(values);
      message.success('统计范围已更新');
    };
    return h('div', { className: 'boss-content-stack boss-dashboard-page' },
      h('section', { className: 'boss-dashboard-scope' },
        h(Form, { form, layout: 'horizontal', initialValues: dashboard.scope.initialValues || {}, onFinish: applyScope },
          h('div', { className: 'boss-dashboard-scope-grid' },
            ...(dashboard.scope.fields || []).map((field) => h(Form.Item, { key: field.key, name: field.key, label: field.label }, controlForField(field))),
            h('div', { className: 'boss-dashboard-scope-actions' }, h(Button, { onClick: () => { form.resetFields(); setScope(dashboard.scope.initialValues || {}); } }, '重 置'), h(Button, { type: 'primary', htmlType: 'submit' }, '更 新'))))),
      h('section', { className: 'boss-dashboard-metrics', style: { '--boss-dashboard-metric-columns': dashboard.metrics.length } },
        ...dashboard.metrics.map((metric) => h('div', { key: metric.key, className: 'boss-dashboard-metric' }, h(Statistic, { title: metric.label, value: metric.value, precision: metric.precision, suffix: metric.unit })))),
      h('section', { className: 'boss-dashboard-charts' },
        ...dashboard.charts.map((chart) => h(DashboardChart, { key: chart.key, chart }))),
      h('span', { className: 'boss-dashboard-scope-status', 'aria-live': 'polite', 'data-dashboard-scope': JSON.stringify(scope) }, dashboard.scope.statusText || '当前展示所选统计范围的数据'));
  }

  function BusinessPage({ spec }) {
    if (spec.metadata.family === 'list') return h(ListPage, { spec });
    if (spec.metadata.family === 'form') return h(FormPage, { spec });
    if (spec.metadata.family === 'detail') return h(DetailPage, { spec });
    if (spec.metadata.family === 'result') return h(ResultPage, { spec });
    if (spec.metadata.family === 'dashboard') return h(DashboardPage, { spec });
    return h(Empty, { description: '当前页面族尚未开放' });
  }

  function mount(spec) {
    const shellConfig = defaultShellConfig(spec);
    const renderContent = ({ activeTabKey }) => activeTabKey === shellConfig.activeTabKey ? h(BusinessPage, { spec }) : null;
    ReactDOM.createRoot(document.getElementById('root')).render(
      h(ConfigProvider, {
        locale: antd.locales?.zh_CN,
        theme: {
          token: theme.antTokens
        }
      }, h(AntApp, null, h(BossLedgerShell, { config: shellConfig, renderContent }))));
  }

  global.BossLedgerPageSpecRuntime = { mount };
})(window);
