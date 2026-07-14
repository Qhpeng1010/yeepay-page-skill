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
  Pagination,
  Select,
  Space,
  Table,
  Tabs,
  Tooltip,
  message
} = antd;

const AntIcons = window.icons || window.antdIcons || window.AntDesignIcons || {};
const {
  BankOutlined,
  CloseOutlined,
  FileSearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  ToolOutlined
} = AntIcons;

dayjs.locale('zh-cn');
const { RangePicker } = DatePicker;

const rows = [
  {
    key: 'SET202607100001',
    batchNo: 'SET202607100001',
    merchantNo: 'M10023981',
    merchantName: '上海海川科技有限公司',
    settlementAmount: '18,560.00',
    status: 'success',
    statusText: '已结算',
    settlementDate: '2026-07-10',
    bankAccount: '招商银行上海分行 6225 **** 9081'
  },
  {
    key: 'SET202607100002',
    batchNo: 'SET202607100002',
    merchantNo: 'M10022873',
    merchantName: '杭州云桥信息服务有限公司',
    settlementAmount: '23,780.00',
    status: 'processing',
    statusText: '结算中',
    settlementDate: '2026-07-10',
    bankAccount: '建设银行杭州西湖支行 6217 **** 2873'
  },
  {
    key: 'SET202607090018',
    batchNo: 'SET202607090018',
    merchantNo: 'M10021106',
    merchantName: '北京星澜餐饮管理有限公司',
    settlementAmount: '9,420.00',
    status: 'success',
    statusText: '已结算',
    settlementDate: '2026-07-09',
    bankAccount: '工商银行北京朝阳支行 6222 **** 1106'
  },
  {
    key: 'SET202607090017',
    batchNo: 'SET202607090017',
    merchantNo: 'M10019852',
    merchantName: '深圳前海嘉汇贸易有限公司',
    settlementAmount: '31,600.00',
    status: 'warning',
    statusText: '待结算',
    settlementDate: '2026-07-09',
    bankAccount: '平安银行深圳分行 6230 **** 9852'
  },
  {
    key: 'SET202607080026',
    batchNo: 'SET202607080026',
    merchantNo: 'M10018736',
    merchantName: '广州南湾酒店管理有限公司',
    settlementAmount: '16,300.00',
    status: 'error',
    statusText: '结算失败',
    settlementDate: '2026-07-08',
    bankAccount: '中国银行广州天河支行 6216 **** 8736'
  },
  {
    key: 'SET202607080021',
    batchNo: 'SET202607080021',
    merchantNo: 'M10017620',
    merchantName: '成都锦里文旅服务有限公司',
    settlementAmount: '12,900.00',
    status: 'success',
    statusText: '已结算',
    settlementDate: '2026-07-08',
    bankAccount: '农业银行成都锦江支行 6228 **** 7620'
  },
  {
    key: 'SET202607070033',
    batchNo: 'SET202607070033',
    merchantNo: 'M10016388',
    merchantName: '南京云栖零售有限公司',
    settlementAmount: '7,400.00',
    status: 'success',
    statusText: '已结算',
    settlementDate: '2026-07-07',
    bankAccount: '交通银行南京鼓楼支行 6014 **** 6388'
  },
  {
    key: 'SET202607070028',
    batchNo: 'SET202607070028',
    merchantNo: 'M10015219',
    merchantName: '天津港湾供应链有限公司',
    settlementAmount: '9,000.00',
    status: 'processing',
    statusText: '结算中',
    settlementDate: '2026-07-07',
    bankAccount: '浦发银行天津滨海支行 6217 **** 5219'
  }
];

function StatusDot({ status, text }) {
  return React.createElement('span', {
    className: `status-dot ${status}`
  }, text);
}

function SettlementRecordPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(rows[0]);
  const [collapsed, setCollapsed] = React.useState(false);
  const [openKeys, setOpenKeys] = React.useState(['fund']);
  const [activeTab, setActiveTab] = React.useState('settlementRecord');
  const [openTabs, setOpenTabs] = React.useState([
    { key: 'dashboard', title: '数据报表', closable: true },
    { key: 'settlementRecord', title: '结算记录查询', closable: true },
    { key: 'accountManage', title: '资金账户', closable: true }
  ]);
  const [visibleColumnKeys, setVisibleColumnKeys] = React.useState([
    'batchNo',
    'merchantNo',
    'merchantName',
    'settlementAmount',
    'status',
    'settlementDate',
    'bankAccount',
    'actions'
  ]);

  const queryFields = [
    {
      key: 'merchantNo',
      node: React.createElement(Form.Item, { label: '商户编号', name: 'merchantNo' },
        React.createElement(Input, { placeholder: '请输入商户编号', allowClear: true }))
    },
    {
      key: 'merchantName',
      node: React.createElement(Form.Item, { label: '商户名称', name: 'merchantName' },
        React.createElement(Input, { placeholder: '请输入商户名称', allowClear: true }))
    },
    {
      key: 'status',
      node: React.createElement(Form.Item, { label: '结算状态', name: 'status' },
        React.createElement(Select, {
          placeholder: '请选择结算状态',
          allowClear: true,
          options: [
            { label: '全部', value: 'all' },
            { label: '待结算', value: 'warning' },
            { label: '结算中', value: 'processing' },
            { label: '已结算', value: 'success' },
            { label: '结算失败', value: 'error' }
          ]
        }))
    },
    {
      key: 'settlementDate',
      node: React.createElement(Form.Item, { label: '结算日期', name: 'settlementDate' },
        React.createElement(RangePicker, {
          style: { width: '100%' },
          placeholder: ['请选择开始日期', '请选择结束日期']
        }))
    },
    {
      key: 'bankAccount',
      node: React.createElement(Form.Item, { label: '银行账户', name: 'bankAccount' },
        React.createElement(Input, { placeholder: '请输入银行账户', allowClear: true }))
    },
    {
      key: 'batchNo',
      node: React.createElement(Form.Item, { label: '结算批次号', name: 'batchNo' },
        React.createElement(Input, { placeholder: '请输入结算批次号', allowClear: true }))
    }
  ];

  const openDrawer = record => {
    setSelectedRow(record);
    setDrawerOpen(true);
  };

  const downloadReceipt = record => {
    message.success(`已生成 ${record.batchNo} 的结算回单`);
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

  const baseColumns = [
    { title: '结算批次号', dataIndex: 'batchNo', key: 'batchNo', width: 168 },
    { title: '商户编号', dataIndex: 'merchantNo', key: 'merchantNo', width: 128 },
    { title: '商户名称', dataIndex: 'merchantName', key: 'merchantName', width: 210, ellipsis: true },
    {
      title: '结算金额(元)',
      dataIndex: 'settlementAmount',
      key: 'settlementAmount',
      width: 136,
      align: 'right',
      render: value => React.createElement('span', { className: 'amount-cell' }, value)
    },
    {
      title: '结算状态',
      dataIndex: 'statusText',
      key: 'status',
      width: 112,
      render: (_, record) => React.createElement(StatusDot, { status: record.status, text: record.statusText })
    },
    { title: '结算日期', dataIndex: 'settlementDate', key: 'settlementDate', width: 120 },
    { title: '银行账户', dataIndex: 'bankAccount', key: 'bankAccount', width: 260, ellipsis: true },
    {
      title: '操作',
      key: 'actions',
      width: 168,
      fixed: 'right',
      className: 'operation-column',
      render: (_, record) => React.createElement('div', { className: 'operation-buttons' },
        React.createElement(Button, { type: 'link', onClick: () => openDrawer(record) }, '查看详情'),
        React.createElement(Button, { type: 'link', className: 'secondary-action', onClick: () => downloadReceipt(record) }, '下载回单'))
    }
  ];

  const columns = baseColumns.filter(column => column.key === 'actions' || visibleColumnKeys.includes(column.key));
  const columnOptions = baseColumns
    .filter(column => column.key !== 'actions')
    .map(column => ({ label: column.title, value: column.key }));

  const columnSettingContent = React.createElement('div', {
    className: 'column-setting-panel',
    onClick: event => event.stopPropagation()
  }, React.createElement('div', { className: 'column-setting-title' }, '列设置'),
    React.createElement(Checkbox.Group, {
      value: visibleColumnKeys.filter(key => key !== 'actions'),
      onChange: values => setVisibleColumnKeys([...values, 'actions'])
    }, React.createElement(Space, { direction: 'vertical', size: 8 },
      columnOptions.map(option => React.createElement(Checkbox, {
        key: option.value,
        value: option.value
      }, option.label)))));

  const tabs = openTabs.map(item => ({
    key: item.key,
    closable: item.closable,
    label: React.createElement(Tooltip, { title: item.title.length > 6 ? item.title : '' },
      React.createElement('span', { className: 'tab-label' },
        activeTab === item.key && React.createElement(ReloadOutlined, { 'data-boss-tab-static-icon': true }),
        React.createElement('span', { className: 'tab-title' }, item.title)))
  }));

  const closeTab = targetKey => {
    if (openTabs.length <= 1) return;
    const targetIndex = openTabs.findIndex(item => item.key === targetKey);
    const nextTabs = openTabs.filter(item => item.key !== targetKey);
    setOpenTabs(nextTabs);
    if (activeTab === targetKey) {
      const nextIndex = Math.min(Math.max(targetIndex - 1, 0), nextTabs.length - 1);
      setActiveTab(nextTabs[nextIndex].key);
    }
  };

  const menuItems = [
    {
      key: 'fund',
      icon: React.createElement(BankOutlined, null),
      label: '资金管理',
      children: [
        { key: 'settlement-record', label: '结算记录查询' },
        { key: 'settlement-batch', label: '结算批次管理' },
        { key: 'bank-account', label: '银行账户管理' }
      ]
    },
    { key: 'merchant', icon: React.createElement(TeamOutlined, null), label: '商户资料' },
    { key: 'reconcile', icon: React.createElement(FileSearchOutlined, null), label: '对账管理' },
    { key: 'risk', icon: React.createElement(SafetyCertificateOutlined, null), label: '风控审核' },
    { key: 'config', icon: React.createElement(ToolOutlined, null), label: '配置管理' }
  ];

  return React.createElement('div', { className: 'boss-page' },
    React.createElement('div', { className: 'topbar', 'data-boss-shell': 'topbar' },
      React.createElement('div', null, '上次登录时间：2026-07-10 09:18:32　登录 IP：10.24.18.66'),
      React.createElement('div', null, '10080090899 · Boss Ledger 财务后台　帮助中心　消息')),
    React.createElement('header', { className: 'primary-nav', 'data-boss-shell': 'primary-nav' },
      React.createElement('div', { className: 'logo-zone' },
        React.createElement('img', { className: 'logo', src: '../../specs/boss logo.svg', alt: 'Boss Ledger', 'data-boss-logo-source': 'specs/boss logo.svg' })),
      React.createElement('nav', { className: 'primary-items' },
        React.createElement('div', { className: 'primary-item' }, '首页'),
        React.createElement('div', { className: 'primary-item' }, '数据报表'),
        React.createElement('div', { className: 'primary-item' }, '商户管理'),
        React.createElement('div', { className: 'primary-item active' }, '资金管理'),
        React.createElement('div', { className: 'primary-item' }, '对账管理'),
        React.createElement('div', { className: 'primary-item' }, '系统管理'))),
    React.createElement('div', { className: 'shell' },
      React.createElement('aside', { className: `sider ${collapsed ? 'collapsed' : ''}`, 'data-boss-shell': 'sider' },
        React.createElement('div', { className: 'sider-menu' },
          React.createElement(Menu, {
            mode: 'inline',
            inlineCollapsed: collapsed,
            inlineCollapsedWidth: 48,
            selectedKeys: ['settlement-record'],
            openKeys: collapsed ? [] : openKeys,
            onOpenChange: setOpenKeys,
            items: menuItems
          })),
        React.createElement('div', {
          className: 'collapse-control',
          'data-boss-sider-collapse': true,
          style: { justifyContent: 'flex-start', textAlign: 'left' },
          onClick: () => setCollapsed(!collapsed)
        },
          collapsed ? React.createElement(MenuUnfoldOutlined, null) : React.createElement(MenuFoldOutlined, null))),
      React.createElement('main', { className: 'workspace' },
        React.createElement('div', { className: 'work-body' },
          React.createElement('div', { className: 'tab-strip', 'data-boss-shell': 'tabs' },
            React.createElement(Tabs, {
              className: 'boss-tabs',
              type: 'editable-card',
              hideAdd: true,
              activeKey: activeTab,
              onChange: setActiveTab,
              onEdit: targetKey => closeTab(targetKey),
              items: tabs
            })),
          React.createElement('section', { className: 'content', 'data-boss-shell': 'content' },
            activeTab !== 'settlementRecord' ? React.createElement('div', { className: 'empty-tab-content' },
              React.createElement(Empty, { description: '当前标签暂无业务数据' })) :
            React.createElement('section', { className: 'query-panel' },
              React.createElement(Form, {
                form,
                layout: 'inline',
                initialValues: {
                  status: 'all',
                  settlementDate: [dayjs().subtract(7, 'day'), dayjs()]
                },
                colon: true
              }, React.createElement('div', { className: 'query-grid', 'data-boss-query-grid': '3' },
                queryFields.map(field => React.createElement(React.Fragment, { key: field.key }, field.node)),
                React.createElement('div', { className: 'query-actions', 'data-boss-query-actions': true, 'data-boss-query-action-slot': '7' },
                  React.createElement(Button, { onClick: resetQuery }, '重 置'),
                  React.createElement(Button, { type: 'primary', loading, onClick: doQuery }, '查 询'))))),
            activeTab === 'settlementRecord' && React.createElement('section', { className: 'table-panel', 'data-boss-table-module': true },
              React.createElement('div', { className: 'toolbar summary-toolbar' },
                React.createElement('div', { className: 'query-summary', 'data-boss-query-summary': true },
                  React.createElement('span', { className: 'query-summary-label' }, '查询统计：'),
                  React.createElement('span', null, '结算总金额：'),
                  React.createElement('span', { className: 'query-summary-value' }, '128,960.00 元'),
                  React.createElement('span', { className: 'query-summary-divider' }, '｜'),
                  React.createElement('span', null, '结算总笔数：'),
                  React.createElement('span', { className: 'query-summary-value' }, '286')),
                React.createElement('div', { className: 'toolbar-actions' },
                  React.createElement(Button, null, '下载Excel'),
                  React.createElement(Tooltip, { title: '列设置' },
                    React.createElement(Dropdown, {
                      trigger: ['click'],
                      placement: 'bottomRight',
                      dropdownRender: () => columnSettingContent
                    }, React.createElement(Button, {
                      className: 'column-setting-button',
                      icon: React.createElement(SettingOutlined, null)
                    }))))),
              React.createElement('div', { className: 'table-body' },
                React.createElement(Table, {
                  rowKey: 'key',
                  loading,
                  columns,
                  dataSource: rows,
                  pagination: false,
                  scroll: { x: 1300 },
                  locale: { emptyText: React.createElement(Empty, { description: '暂无符合条件的结算记录' }) }
                }),
                React.createElement('div', { className: 'table-pagination' },
                  React.createElement(Pagination, {
                    current: 1,
                    pageSize: 10,
                    showSizeChanger: { getPopupContainer: () => document.body },
                    pageSizeOptions: [10, 20, 50, 100],
                    locale: { items_per_page: '条/页', jump_to: '跳至', page: '页' },
                    total: 286,
                    showTotal: total => `共 ${total} 条`
                  }))),
              React.createElement('div', { className: 'table-fill' })),
            React.createElement('footer', { className: 'footer' }, '© 2026 易宝支付有限公司 版权所有'))))),
    React.createElement(Drawer, {
      title: React.createElement('div', { className: 'drawer-title-bar' },
        React.createElement('span', { className: 'drawer-title-text' }, '结算记录详情'),
        React.createElement(Button, {
          className: 'drawer-title-close',
          type: 'text',
          icon: React.createElement(CloseOutlined, null),
          onClick: () => setDrawerOpen(false)
        })),
      width: 720,
      open: drawerOpen,
      onClose: () => setDrawerOpen(false),
      closable: false,
      footer: React.createElement(Space, { style: { display: 'flex', justifyContent: 'flex-end' } },
        React.createElement(Button, { onClick: () => setDrawerOpen(false) }, '取 消'),
        React.createElement(Button, { type: 'primary', onClick: () => downloadReceipt(selectedRow) }, '下载回单'))
    },
      React.createElement('div', { className: 'drawer-section' },
        React.createElement('div', { className: 'drawer-section-title' }, '结算信息'),
        React.createElement(Descriptions, { column: 3, size: 'small' },
          React.createElement(Descriptions.Item, { label: '结算批次号' }, selectedRow?.batchNo),
          React.createElement(Descriptions.Item, { label: '结算状态' }, selectedRow?.statusText),
          React.createElement(Descriptions.Item, { label: '结算日期' }, selectedRow?.settlementDate),
          React.createElement(Descriptions.Item, { label: '结算金额(元)' }, selectedRow?.settlementAmount),
          React.createElement(Descriptions.Item, { label: '结算笔数' }, '36'),
          React.createElement(Descriptions.Item, { label: '回单状态' }, selectedRow?.status === 'success' ? '可下载' : '生成中'))),
      React.createElement('div', { className: 'drawer-section' },
        React.createElement('div', { className: 'drawer-section-title' }, '商户信息'),
        React.createElement(Descriptions, { column: 3, size: 'small' },
          React.createElement(Descriptions.Item, { label: '商户编号' }, selectedRow?.merchantNo),
          React.createElement(Descriptions.Item, { label: '商户名称' }, selectedRow?.merchantName),
          React.createElement(Descriptions.Item, { label: '银行账户' }, selectedRow?.bankAccount))),
      React.createElement('div', { className: 'drawer-section' },
        React.createElement('div', { className: 'drawer-section-title' }, '处理信息'),
        React.createElement(Descriptions, { column: 3, size: 'small' },
          React.createElement(Descriptions.Item, { label: '结算渠道' }, '网银代付'),
          React.createElement(Descriptions.Item, { label: '发起时间' }, `${selectedRow?.settlementDate || '-'} 08:30:00`),
          React.createElement(Descriptions.Item, { label: '完成时间' }, selectedRow?.status === 'success' ? `${selectedRow?.settlementDate} 10:18:36` : '-')))));
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
  }, React.createElement(App, null, React.createElement(SettlementRecordPage, null)));
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Root, null));
