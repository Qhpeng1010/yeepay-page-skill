const {
  App,
  Button,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu,
  Modal,
  Pagination,
  Radio,
  Select,
  Space,
  Table,
  Tabs,
  Timeline,
  Tooltip,
  message,
  theme
} = antd;
const AntIcons = window.icons || window.antdIcons || window.AntDesignIcons || {};
const {
  AuditOutlined,
  BankOutlined,
  CloseOutlined,
  DownOutlined,
  FileSearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  ToolOutlined,
  UpOutlined
} = AntIcons;
dayjs.locale('zh-cn');
const {
  RangePicker
} = DatePicker;
const {
  TextArea
} = Input;
const rows = [{
  key: 'AUD202607080001',
  auditNo: 'AUD202607080001',
  merchantNo: 'M10023981',
  merchantName: '上海海川科技有限公司',
  materialType: '主体资料',
  submitTime: '2026-07-08 09:32:10',
  status: 'pending',
  statusText: '待审核',
  auditor: '-',
  updateTime: '2026-07-08 09:32:10'
}, {
  key: 'AUD202607070018',
  auditNo: 'AUD202607070018',
  merchantNo: 'M10022873',
  merchantName: '杭州云桥信息服务有限公司',
  materialType: '结算资料',
  submitTime: '2026-07-07 16:15:48',
  status: 'success',
  statusText: '审核通过',
  auditor: '李敏',
  updateTime: '2026-07-07 17:02:19'
}, {
  key: 'AUD202607070011',
  auditNo: 'AUD202607070011',
  merchantNo: 'M10021106',
  merchantName: '北京星澜餐饮管理有限公司',
  materialType: '证照资料',
  submitTime: '2026-07-07 11:02:33',
  status: 'error',
  statusText: '审核驳回',
  auditor: '王磊',
  updateTime: '2026-07-07 11:40:08'
}, {
  key: 'AUD202607060027',
  auditNo: 'AUD202607060027',
  merchantNo: 'M10019852',
  merchantName: '深圳前海嘉汇贸易有限公司',
  materialType: '联系人资料',
  submitTime: '2026-07-06 18:45:22',
  status: 'processing',
  statusText: '处理中',
  auditor: '系统',
  updateTime: '2026-07-06 18:47:06'
}, {
  key: 'AUD202607060019',
  auditNo: 'AUD202607060019',
  merchantNo: 'M10018736',
  merchantName: '广州南湾酒店管理有限公司',
  materialType: '主体资料',
  submitTime: '2026-07-06 14:21:09',
  status: 'pending',
  statusText: '待审核',
  auditor: '陈洁',
  updateTime: '2026-07-06 14:21:09'
}, {
  key: 'AUD202607050042',
  auditNo: 'AUD202607050042',
  merchantNo: 'M10017620',
  merchantName: '成都锦里文旅服务有限公司',
  materialType: '证照资料',
  submitTime: '2026-07-05 17:08:56',
  status: 'success',
  statusText: '审核通过',
  auditor: '周宇',
  updateTime: '2026-07-05 17:26:31'
}, {
  key: 'AUD202607050031',
  auditNo: 'AUD202607050031',
  merchantNo: 'M10016388',
  merchantName: '南京云栖零售有限公司',
  materialType: '联系人资料',
  submitTime: '2026-07-05 10:36:44',
  status: 'error',
  statusText: '审核驳回',
  auditor: '王磊',
  updateTime: '2026-07-05 10:58:15'
}, {
  key: 'AUD202607040028',
  auditNo: 'AUD202607040028',
  merchantNo: 'M10015219',
  merchantName: '天津港湾供应链有限公司',
  materialType: '结算资料',
  submitTime: '2026-07-04 15:19:27',
  status: 'pending',
  statusText: '待审核',
  auditor: '-',
  updateTime: '2026-07-04 15:19:27'
}];
function StatusDot({
  status,
  text
}) {
  const cls = status === 'pending' ? 'warning' : status;
  return React.createElement("span", {
    className: `status-dot ${cls}`
  }, text);
}
function MerchantAuditPage() {
  const [form] = Form.useForm();
  const [auditForm] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [auditResult, setAuditResult] = React.useState('pass');
  const [selectedRow, setSelectedRow] = React.useState(rows[0]);
  const [collapsed, setCollapsed] = React.useState(false);
  const [openKeys, setOpenKeys] = React.useState(['audit']);
  const [activeTab, setActiveTab] = React.useState('merchantAudit');
  const [queryExpanded, setQueryExpanded] = React.useState(false);
  const [visibleColumnKeys, setVisibleColumnKeys] = React.useState(['merchantNo', 'merchantName', 'materialType', 'submitTime', 'status', 'auditor', 'updateTime', 'actions']);
  const queryFields = [{
    key: 'merchantNo',
    node: React.createElement(Form.Item, {
      label: "\u5546\u6237\u7F16\u53F7",
      name: "merchantNo"
    }, React.createElement(Input, {
      placeholder: "\u8BF7\u8F93\u5165\u5546\u6237\u7F16\u53F7",
      allowClear: true
    }))
  }, {
    key: 'merchantName',
    node: React.createElement(Form.Item, {
      label: "\u5546\u6237\u540D\u79F0",
      name: "merchantName"
    }, React.createElement(Input, {
      placeholder: "\u8BF7\u8F93\u5165\u5546\u6237\u540D\u79F0",
      allowClear: true
    }))
  }, {
    key: 'status',
    node: React.createElement(Form.Item, {
      label: "\u5BA1\u6838\u72B6\u6001",
      name: "status"
    }, React.createElement(Select, {
      placeholder: "\u8BF7\u9009\u62E9\u5BA1\u6838\u72B6\u6001",
      options: [{
        label: '待审核',
        value: 'pending'
      }, {
        label: '审核通过',
        value: 'success'
      }, {
        label: '审核驳回',
        value: 'error'
      }, {
        label: '处理中',
        value: 'processing'
      }]
    }))
  }, {
    key: 'submitTime',
    node: React.createElement(Form.Item, {
      label: "\u63D0\u4EA4\u65F6\u95F4",
      name: "submitTime"
    }, React.createElement(RangePicker, {
      style: {
        width: '100%'
      },
      placeholder: ['请选择开始日期', '请选择结束日期']
    }))
  }, {
    key: 'auditor',
    node: React.createElement(Form.Item, {
      label: "\u5BA1\u6838\u4EBA",
      name: "auditor"
    }, React.createElement(Input, {
      placeholder: "\u8BF7\u8F93\u5165\u5BA1\u6838\u4EBA",
      allowClear: true
    }))
  }, {
    key: 'materialType',
    node: React.createElement(Form.Item, {
      label: "\u8D44\u6599\u7C7B\u578B",
      name: "materialType"
    }, React.createElement(Select, {
      placeholder: "\u8BF7\u9009\u62E9\u8D44\u6599\u7C7B\u578B",
      options: [{
        label: '全部',
        value: 'all'
      }, {
        label: '主体资料',
        value: 'base'
      }, {
        label: '证照资料',
        value: 'license'
      }, {
        label: '结算资料',
        value: 'settlement'
      }, {
        label: '联系人资料',
        value: 'contact'
      }]
    }))
  }];
  const visibleQueryFields = queryExpanded ? queryFields : queryFields.slice(0, 6);
  const shouldShowQueryToggle = queryFields.length > 6;
  const openDrawer = record => {
    setSelectedRow(record);
    setDrawerOpen(true);
  };
  const openAudit = (record, result = 'pass') => {
    setSelectedRow(record);
    setAuditResult(result);
    auditForm.resetFields();
    auditForm.setFieldsValue({
      result
    });
    setModalOpen(true);
  };
  const doQuery = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('查询完成');
    }, 700);
  };
  const resetQuery = () => {
    form.resetFields();
    message.success('查询条件已重置');
  };
  const submitAudit = async () => {
    try {
      await auditForm.validateFields();
      Modal.confirm({
        title: auditResult === 'pass' ? '确认审核通过？' : '确认审核驳回？',
        content: auditResult === 'pass' ? '通过后商户资料将进入后续生效流程。' : '驳回后商户需要按原因重新提交资料。',
        okText: '确 认',
        cancelText: '取 消',
        onOk: () => {
          setModalOpen(false);
          setDrawerOpen(false);
          message.success(auditResult === 'pass' ? '审核通过成功' : '审核驳回成功');
        }
      });
    } catch (error) {
      message.error('请完善审核信息');
    }
  };
  const baseColumns = [{
    title: '商户编号',
    dataIndex: 'merchantNo',
    key: 'merchantNo',
    width: 120
  }, {
    title: '商户名称',
    dataIndex: 'merchantName',
    key: 'merchantName',
    width: 200,
    ellipsis: true
  }, {
    title: '资料类型',
    dataIndex: 'materialType',
    key: 'materialType',
    width: 110
  }, {
    title: '提交时间',
    dataIndex: 'submitTime',
    key: 'submitTime',
    width: 168
  }, {
    title: '审核状态',
    dataIndex: 'statusText',
    key: 'status',
    width: 118,
    render: (_, record) => React.createElement(StatusDot, {
      status: record.status,
      text: record.statusText
    })
  }, {
    title: '审核人',
    dataIndex: 'auditor',
    key: 'auditor',
    width: 96
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 168
  }, {
    title: '操作',
    key: 'actions',
    width: 176,
    fixed: 'right',
    className: 'operation-column',
    render: (_, record) => React.createElement("div", {
      className: "operation-buttons"
    }, React.createElement(Button, {
      type: "link",
      onClick: () => openDrawer(record)
    }, "\u67E5\u770B\u8BE6\u60C5"), React.createElement(Button, {
      type: "link",
      disabled: record.status !== 'pending',
      onClick: () => openAudit(record, 'pass')
    }, "\u5BA1\u6838"), React.createElement(Button, {
      type: "link",
      disabled: record.status !== 'pending',
      onClick: () => openAudit(record, 'reject')
    }, "\u9A73\u56DE"))
  }];
  const columns = baseColumns.filter(column => column.key === 'actions' || visibleColumnKeys.includes(column.key));
  const columnOptions = baseColumns.filter(column => column.key !== 'actions').map(column => ({
    label: column.title,
    value: column.key
  }));
  const columnSettingContent = React.createElement("div", {
    className: "column-setting-panel",
    onClick: event => event.stopPropagation()
  }, React.createElement("div", {
    className: "column-setting-title"
  }, "\u5217\u8BBE\u7F6E"), React.createElement(Checkbox.Group, {
    value: visibleColumnKeys.filter(key => key !== 'actions'),
    onChange: values => setVisibleColumnKeys([...values, 'actions'])
  }, React.createElement(Space, {
    direction: "vertical",
    size: 8
  }, columnOptions.map(option => React.createElement(Checkbox, {
    key: option.value,
    value: option.value
  }, option.label)))));
  const tabs = [{
    key: 'dashboard',
    title: '数据报表',
    closable: true
  }, {
    key: 'merchantAudit',
    title: '商户审核查询',
    closable: true
  }, {
    key: 'operator',
    title: '操作员管理',
    closable: true
  }].map(item => ({
    key: item.key,
    closable: item.closable,
    label: React.createElement(Tooltip, {
      title: item.title.length > 6 ? item.title : ''
    }, React.createElement("span", {
      className: "tab-label"
    }, activeTab === item.key && React.createElement(ReloadOutlined, null), React.createElement("span", {
      className: "tab-title"
    }, item.title)))
  }));
  const menuItems = [{
    key: 'audit',
    icon: React.createElement(AuditOutlined, null),
    label: '商户审核',
    children: [{
      key: 'merchant-audit',
      label: '商户审核查询'
    }, {
      key: 'settlement-audit',
      label: '结算资料审核'
    }, {
      key: 'account-audit',
      label: '账户变更审核'
    }]
  }, {
    key: 'merchant',
    icon: React.createElement(TeamOutlined, null),
    label: '商户资料'
  }, {
    key: 'config',
    icon: React.createElement(ToolOutlined, null),
    label: '配置管理'
  }, {
    key: 'risk',
    icon: React.createElement(SafetyCertificateOutlined, null),
    label: '风控审核'
  }];
  return React.createElement("div", {
    className: "boss-page"
  }, React.createElement("div", {
    className: "topbar"
  }, React.createElement("div", null, "\u4E0A\u6B21\u767B\u5F55\u65F6\u95F4\uFF1A2026-07-08 09:18:32\u3000\u767B\u5F55 IP\uFF1A10.24.18.66"), React.createElement("div", null, "10080090899 \xB7 Boss Ledger \u5546\u6237\u5BA1\u6838\u540E\u53F0\u3000\u5E2E\u52A9\u4E2D\u5FC3\u3000\u6D88\u606F")), React.createElement("header", {
    className: "primary-nav"
  }, React.createElement("div", {
    className: "logo-zone"
  }, React.createElement("img", {
    className: "logo",
    src: "./assets/boss-ledger-logo.svg",
    alt: "\u8001\u677F\u7BA1\u8D26"
  })), React.createElement("nav", {
    className: "primary-items"
  }, React.createElement("div", {
    className: "primary-item"
  }, "\u9996\u9875"), React.createElement("div", {
    className: "primary-item"
  }, "\u6570\u636E\u62A5\u8868"), React.createElement("div", {
    className: "primary-item active"
  }, "\u5546\u6237\u7BA1\u7406"), React.createElement("div", {
    className: "primary-item"
  }, "\u8D44\u91D1\u7BA1\u7406"), React.createElement("div", {
    className: "primary-item"
  }, "\u5BF9\u8D26\u7BA1\u7406"), React.createElement("div", {
    className: "primary-item"
  }, "\u7CFB\u7EDF\u7BA1\u7406"))), React.createElement("div", {
    className: "shell"
  }, React.createElement("aside", {
    className: `sider ${collapsed ? 'collapsed' : ''}`
  }, React.createElement("div", {
    className: "sider-menu"
  }, React.createElement(Menu, {
    mode: "inline",
    inlineCollapsed: collapsed,
    inlineCollapsedWidth: 48,
    selectedKeys: ['merchant-audit'],
    openKeys: collapsed ? [] : openKeys,
    onOpenChange: setOpenKeys,
    items: menuItems
  })), React.createElement("div", {
    className: "collapse-control",
    onClick: () => setCollapsed(!collapsed)
  }, collapsed ? React.createElement(MenuUnfoldOutlined, null) : React.createElement(MenuFoldOutlined, null))), React.createElement("main", {
    className: "workspace"
  }, React.createElement("div", {
    className: "work-body"
  }, React.createElement("div", {
    className: "tab-strip"
  }, React.createElement(Tabs, {
    className: "boss-tabs",
    type: "editable-card",
    hideAdd: true,
    activeKey: activeTab,
    onChange: setActiveTab,
    items: tabs
  })), React.createElement("section", {
    className: "content"
  }, React.createElement("section", {
    className: "query-panel"
  }, React.createElement(Form, {
    form: form,
    layout: "inline",
    initialValues: {
      status: 'pending',
      submitTime: [dayjs().subtract(7, 'day'), dayjs()]
    },
    colon: true
  }, React.createElement("div", {
    className: "query-grid"
  }, visibleQueryFields.map(field => React.createElement(React.Fragment, {
    key: field.key
  }, field.node)), React.createElement("div", {
    className: "query-actions"
  }, shouldShowQueryToggle && React.createElement(Button, {
    className: "query-toggle",
    type: "text",
    icon: queryExpanded ? React.createElement(UpOutlined, null) : React.createElement(DownOutlined, null),
    onClick: () => setQueryExpanded(!queryExpanded)
  }, queryExpanded ? '收 起' : '展 开'), React.createElement(Button, {
    onClick: resetQuery
  }, "\u91CD \u7F6E"), React.createElement(Button, {
    type: "primary",
    loading: loading,
    onClick: doQuery
  }, "\u67E5 \u8BE2"))))), React.createElement("section", {
    className: "table-panel"
  }, React.createElement("div", {
    className: "toolbar"
  }, React.createElement("div", {
    className: "toolbar-title"
  }, "\u67E5\u8BE2\u5217\u8868"), React.createElement("div", {
    className: "toolbar-actions"
  }, React.createElement(Button, null, "\u4E0B\u8F7DExcel"), React.createElement(Tooltip, {
    title: "\u5217\u8BBE\u7F6E"
  }, React.createElement(Dropdown, {
    trigger: ['click'],
    placement: "bottomRight",
    dropdownRender: () => columnSettingContent
  }, React.createElement(Button, {
    className: "column-setting-button",
    icon: React.createElement(SettingOutlined, null)
  }))))), React.createElement("div", {
    className: "table-body"
  }, React.createElement(Table, {
    rowKey: "key",
    loading: loading,
    columns: columns,
    dataSource: rows,
    pagination: false,
    scroll: {
      x: 1160
    },
    locale: {
      emptyText: React.createElement(Empty, {
        description: "\u6682\u65E0\u7B26\u5408\u6761\u4EF6\u7684\u5BA1\u6838\u4EFB\u52A1"
      })
    }
  }), React.createElement("div", {
    className: "table-pagination"
  }, React.createElement(Pagination, {
    current: 1,
    pageSize: 10,
    showSizeChanger: { getPopupContainer: () => document.body },
    pageSizeOptions: [10, 20, 50, 100],
    locale: { items_per_page: '条/页', jump_to: '跳至', page: '页' },
    total: 48,
    showTotal: total => `共 ${total} 条`
  }))), React.createElement("div", {
    className: "table-fill"
  })), React.createElement("footer", {
    className: "page-footer"
  }, "\xA9 2026 \u6613\u5B9D\u652F\u4ED8\u6709\u9650\u516C\u53F8 \u7248\u6743\u6240\u6709"))))), React.createElement(Drawer, {
    title: React.createElement("div", {
      className: "drawer-title-bar"
    }, React.createElement("span", {
      className: "drawer-title-text"
    }, "\u5546\u6237\u5BA1\u6838\u8BE6\u60C5"), React.createElement(Button, {
      className: "drawer-title-close",
      type: "text",
      icon: React.createElement(CloseOutlined, null),
      onClick: () => setDrawerOpen(false)
    })),
    width: 720,
    open: drawerOpen,
    onClose: () => setDrawerOpen(false),
    closable: false,
    footer: React.createElement(Space, {
      style: {
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }, React.createElement(Button, {
      onClick: () => setDrawerOpen(false)
    }, "\u53D6 \u6D88"), selectedRow?.status === 'pending' && React.createElement(Button, {
      type: "primary",
      onClick: () => openAudit(selectedRow)
    }, "\u5BA1 \u6838"))
  }, React.createElement("div", {
    className: "drawer-section"
  }, React.createElement("div", {
    className: "drawer-section-title"
  }, "\u57FA\u7840\u4FE1\u606F"), React.createElement(Descriptions, {
    column: 3,
    size: "small"
  }, React.createElement(Descriptions.Item, {
    label: "\u5546\u6237\u7F16\u53F7"
  }, selectedRow?.merchantNo), React.createElement(Descriptions.Item, {
    label: "\u5546\u6237\u540D\u79F0"
  }, selectedRow?.merchantName), React.createElement(Descriptions.Item, {
    label: "\u8D44\u6599\u7C7B\u578B"
  }, selectedRow?.materialType), React.createElement(Descriptions.Item, {
    label: "\u7EDF\u4E00\u793E\u4F1A\u4FE1\u7528\u4EE3\u7801"
  }, "91310115MA1K3A8Q2N"), React.createElement(Descriptions.Item, {
    label: "\u5BA1\u6838\u4EBA"
  }, selectedRow?.auditor), React.createElement(Descriptions.Item, {
    label: "\u63D0\u4EA4\u65F6\u95F4"
  }, selectedRow?.submitTime), React.createElement(Descriptions.Item, {
    label: "\u66F4\u65B0\u65F6\u95F4"
  }, selectedRow?.updateTime))), React.createElement("div", {
    className: "drawer-section"
  }, React.createElement("div", {
    className: "drawer-section-title"
  }, "\u8BC1\u7167\u8D44\u6599"), React.createElement(Descriptions, {
    column: 3,
    size: "small"
  }, React.createElement(Descriptions.Item, {
    label: "\u8425\u4E1A\u6267\u7167"
  }, "\u5DF2\u4E0A\u4F20"), React.createElement(Descriptions.Item, {
    label: "\u6CD5\u4EBA\u8BC1\u4EF6"
  }, "\u5DF2\u4E0A\u4F20"), React.createElement(Descriptions.Item, {
    label: "\u8D44\u6599\u6709\u6548\u671F"
  }, "2026-12-31"), React.createElement(Descriptions.Item, {
    label: "\u5BA1\u6838\u8D44\u6599\u7C7B\u578B"
  }, selectedRow?.materialType))), React.createElement("div", {
    className: "drawer-section"
  }, React.createElement("div", {
    className: "drawer-section-title"
  }, "\u7ED3\u7B97\u4FE1\u606F"), React.createElement(Descriptions, {
    column: 3,
    size: "small"
  }, React.createElement(Descriptions.Item, {
    label: "\u5F00\u6237\u94F6\u884C"
  }, "\u62DB\u5546\u94F6\u884C\u4E0A\u6D77\u5206\u884C"), React.createElement(Descriptions.Item, {
    label: "\u8D26\u6237\u540D\u79F0"
  }, selectedRow?.merchantName), React.createElement(Descriptions.Item, {
    label: "\u8D26\u6237\u5C3E\u53F7"
  }, "8392"))), React.createElement("div", {
    className: "drawer-section"
  }, React.createElement("div", {
    className: "drawer-section-title"
  }, "\u5BA1\u6838\u8BB0\u5F55"), React.createElement(Timeline, {
    items: [{
      color: 'blue',
      children: '2026-07-08 09:32:10 merchant_admin 提交资料'
    }, {
      color: selectedRow?.status === 'pending' ? 'gray' : 'green',
      children: `${selectedRow?.auditor || '-'} ${selectedRow?.statusText || '-'}`
    }]
  }))), React.createElement(Modal, {
    className: "audit-modal",
    title: "\u5BA1\u6838\u5904\u7406",
    open: modalOpen,
    onCancel: () => setModalOpen(false),
    footer: [React.createElement(Button, {
      key: "closeAction",
      onClick: () => setModalOpen(false)
    }, "\u53D6 \u6D88"), React.createElement(Button, {
      key: "confirm",
      type: "primary",
      onClick: submitAudit
    }, "\u786E \u8BA4")]
  }, React.createElement(Form, {
    form: auditForm,
    layout: "vertical",
    initialValues: {
      result: auditResult
    }
  }, React.createElement(Form.Item, {
    label: "\u5BA1\u6838\u7ED3\u679C",
    name: "result",
    rules: [{
      required: true,
      message: '请选择审核结果'
    }]
  }, React.createElement(Radio.Group, {
    onChange: e => setAuditResult(e.target.value)
  }, React.createElement(Radio, {
    value: "pass"
  }, "\u901A\u8FC7"), React.createElement(Radio, {
    value: "reject"
  }, "\u9A73\u56DE"))), auditResult === 'reject' && React.createElement(Form.Item, {
    label: "\u9A73\u56DE\u539F\u56E0",
    name: "rejectReason",
    rules: [{
      required: true,
      message: '请输入驳回原因'
    }]
  }, React.createElement(TextArea, {
    rows: 4,
    maxLength: 200,
    showCount: true,
    placeholder: "\u8BF7\u8F93\u5165\u9A73\u56DE\u539F\u56E0\uFF0C\u6700\u591A 200 \u5B57"
  })), React.createElement(Form.Item, {
    label: "\u5BA1\u6838\u5907\u6CE8",
    name: "remark"
  }, React.createElement(TextArea, {
    rows: 3,
    maxLength: 200,
    showCount: true,
    placeholder: "\u8BF7\u8F93\u5165\u5BA1\u6838\u5907\u6CE8"
  })))));
}
function Root() {
  return React.createElement(ConfigProvider, {
    locale: antd.locales && antd.locales.zh_CN || antd.locale && antd.locale.zh_CN,
    theme: {
      cssVar: true,
      token: {
        colorPrimary: '#F36046',
        colorLink: '#F36046',
        colorInfo: '#F36046',
        lineWidth: 1,
        controlHeight: 32,
        borderRadius: 4
      }
    }
  }, React.createElement(App, null, React.createElement(MerchantAuditPage, null)));
}
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Root, null));
