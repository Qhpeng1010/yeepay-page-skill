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
  Statistic,
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
    key: 'BLT202607100001',
    orderNo: 'BLT202607100001',
    merchantNo: 'M10023981',
    merchantName: '上海海川科技有限公司',
    payMethod: '微信支付',
    amount: '18,560.00',
    status: 'success',
    statusText: '交易成功',
    tradeTime: '2026-07-10 10:28:36',
    refundAmount: '0.00',
    voucherStatus: '可下载'
  },
  {
    key: 'BLT202607100002',
    orderNo: 'BLT202607100002',
    merchantNo: 'M10022873',
    merchantName: '杭州云桥信息服务有限公司',
    payMethod: '支付宝',
    amount: '2,380.00',
    status: 'processing',
    statusText: '处理中',
    tradeTime: '2026-07-10 10:12:08',
    refundAmount: '0.00',
    voucherStatus: '生成中'
  },
  {
    key: 'BLT202607090018',
    orderNo: 'BLT202607090018',
    merchantNo: 'M10021106',
    merchantName: '北京星澜餐饮管理有限公司',
    payMethod: '银行卡',
    amount: '9,420.00',
    status: 'success',
    statusText: '交易成功',
    tradeTime: '2026-07-09 18:42:17',
    refundAmount: '0.00',
    voucherStatus: '可下载'
  },
  {
    key: 'BLT202607090017',
    orderNo: 'BLT202607090017',
    merchantNo: 'M10019852',
    merchantName: '深圳前海嘉汇贸易有限公司',
    payMethod: '云闪付',
    amount: '31,600.00',
    status: 'warning',
    statusText: '待支付',
    tradeTime: '2026-07-09 16:08:55',
    refundAmount: '0.00',
    voucherStatus: '未生成'
  },
  {
    key: 'BLT202607080026',
    orderNo: 'BLT202607080026',
    merchantNo: 'M10018736',
    merchantName: '广州南湾酒店管理有限公司',
    payMethod: '微信支付',
    amount: '16,300.00',
    status: 'error',
    statusText: '交易失败',
    tradeTime: '2026-07-08 21:33:41',
    refundAmount: '0.00',
    voucherStatus: '不可下载'
  },
  {
    key: 'BLT202607080021',
    orderNo: 'BLT202607080021',
    merchantNo: 'M10017620',
    merchantName: '成都锦里文旅服务有限公司',
    payMethod: '支付宝',
    amount: '12,900.00',
    status: 'success',
    statusText: '部分退款',
    tradeTime: '2026-07-08 14:25:09',
    refundAmount: '1,280.00',
    voucherStatus: '可下载'
  },
  {
    key: 'BLT202607070033',
    orderNo: 'BLT202607070033',
    merchantNo: 'M10016388',
    merchantName: '南京云栖零售有限公司',
    payMethod: '银行卡',
    amount: '7,400.00',
    status: 'success',
    statusText: '交易成功',
    tradeTime: '2026-07-07 11:19:42',
    refundAmount: '0.00',
    voucherStatus: '可下载'
  },
  {
    key: 'BLT202607070028',
    orderNo: 'BLT202607070028',
    merchantNo: 'M10015219',
    merchantName: '天津港湾供应链有限公司',
    payMethod: '微信支付',
    amount: '9,000.00',
    status: 'processing',
    statusText: '退款中',
    tradeTime: '2026-07-07 09:46:28',
    refundAmount: '9,000.00',
    voucherStatus: '可下载'
  }
];

const stats = [
  { label: '交易总金额(元)', value: '107,560.00' },
  { label: '交易总笔数(笔)', value: '286' },
  { label: '成功交易金额(元)', value: '86,660.00' },
  { label: '退款总金额(元)', value: '10,280.00' }
];

function StatusDot({ status, text }) {
  return React.createElement('span', {
    className: `status-dot ${status}`
  }, text);
}

function TransactionFlowPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(rows[0]);
  const [collapsed, setCollapsed] = React.useState(false);
  const [openKeys, setOpenKeys] = React.useState(['fund']);
  const [activeTab, setActiveTab] = React.useState('transactionFlow');
  const [visibleColumnKeys, setVisibleColumnKeys] = React.useState([
    'orderNo',
    'merchantNo',
    'merchantName',
    'payMethod',
    'amount',
    'status',
    'tradeTime',
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
      node: React.createElement(Form.Item, { label: '交易状态', name: 'status' },
        React.createElement(Select, {
          placeholder: '请选择交易状态',
          allowClear: true,
          options: [
            { label: '全部', value: 'all' },
            { label: '待支付', value: 'warning' },
            { label: '处理中', value: 'processing' },
            { label: '交易成功', value: 'success' },
            { label: '部分退款', value: 'partialRefund' },
            { label: '交易失败', value: 'error' }
          ]
        }))
    },
    {
      key: 'payMethod',
      node: React.createElement(Form.Item, { label: '支付方式', name: 'payMethod' },
        React.createElement(Select, {
          placeholder: '请选择支付方式',
          allowClear: true,
          options: [
            { label: '全部', value: 'all' },
            { label: '微信支付', value: 'wechat' },
            { label: '支付宝', value: 'alipay' },
            { label: '银行卡', value: 'bankCard' },
            { label: '云闪付', value: 'unionPay' }
          ]
        }))
    },
    {
      key: 'tradeTime',
      node: React.createElement(Form.Item, { label: '交易时间', name: 'tradeTime' },
        React.createElement(RangePicker, {
          style: { width: '100%' },
          placeholder: ['请选择开始日期', '请选择结束日期']
        }))
    },
    {
      key: 'orderNo',
      node: React.createElement(Form.Item, { label: '订单号', name: 'orderNo' },
        React.createElement(Input, { placeholder: '请输入订单号', allowClear: true }))
    }
  ];
  const shouldShowQueryToggle = queryFields.length > 6;

  const openDrawer = record => {
    setSelectedRow(record);
    setDrawerOpen(true);
  };

  const startRefund = record => {
    if (record.status === 'error' || record.status === 'warning') {
      message.warning(`${record.orderNo} 当前状态不可发起退款`);
      return;
    }
    message.success(`已提交 ${record.orderNo} 的退款申请`);
  };

  const downloadVoucher = record => {
    if (record.voucherStatus !== '可下载') {
      message.warning(`${record.orderNo} 的交易凭证暂不可下载`);
      return;
    }
    message.success(`已生成 ${record.orderNo} 的交易凭证`);
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
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 168 },
    { title: '商户编号', dataIndex: 'merchantNo', key: 'merchantNo', width: 128 },
    { title: '商户名称', dataIndex: 'merchantName', key: 'merchantName', width: 210, ellipsis: true },
    { title: '支付方式', dataIndex: 'payMethod', key: 'payMethod', width: 112 },
    {
      title: '交易金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 136,
      align: 'right',
      render: value => React.createElement('span', { className: 'amount-cell' }, value)
    },
    {
      title: '交易状态',
      dataIndex: 'statusText',
      key: 'status',
      width: 112,
      render: (_, record) => React.createElement(StatusDot, { status: record.status, text: record.statusText })
    },
    { title: '交易时间', dataIndex: 'tradeTime', key: 'tradeTime', width: 168 },
    {
      title: '操作',
      key: 'actions',
      width: 220,
      fixed: 'right',
      className: 'operation-column',
      render: (_, record) => React.createElement('div', { className: 'operation-buttons' },
        React.createElement(Button, { type: 'link', onClick: () => openDrawer(record) }, '查看详情'),
        React.createElement(Button, { type: 'link', className: 'secondary-action', onClick: () => startRefund(record) }, '发起退款'),
        React.createElement(Button, { type: 'link', className: 'secondary-action', onClick: () => downloadVoucher(record) }, '下载凭证'))
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

  const tabs = [
    { key: 'dashboard', title: '数据报表', closable: true },
    { key: 'transactionFlow', title: '交易流水查询', closable: true },
    { key: 'refundRecord', title: '退款记录', closable: true }
  ].map(item => ({
    key: item.key,
    closable: item.closable,
    label: React.createElement(Tooltip, { title: item.title.length > 6 ? item.title : '' },
      React.createElement('span', { className: 'tab-label' },
        React.createElement(ReloadOutlined, { 'data-boss-tab-static-icon': true }),
        React.createElement('span', { className: 'tab-title' }, item.title)))
  }));

  const menuItems = [
    {
      key: 'fund',
      icon: React.createElement(BankOutlined, null),
      label: '资金管理',
      children: [
        { key: 'transaction-flow', label: '交易流水查询' },
        { key: 'refund-record', label: '退款记录查询' },
        { key: 'settlement-record', label: '结算记录查询' },
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
      React.createElement('div', null, '10080090899 · Boss Ledger 运营后台　帮助中心　消息')),
    React.createElement('header', { className: 'primary-nav', 'data-boss-shell': 'primary-nav' },
      React.createElement('div', { className: 'logo-zone' },
        React.createElement('img', {
          className: 'logo',
          src: './assets/boss-ledger-logo.svg',
          alt: '老板管账',
          'data-boss-logo-source': 'specs/boss logo.svg'
        })),
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
            selectedKeys: ['transaction-flow'],
            openKeys: collapsed ? [] : openKeys,
            onOpenChange: setOpenKeys,
            items: menuItems
          })),
        React.createElement('div', {
          className: 'collapse-control sider-toggle',
          'data-boss-sider-collapse': true,
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
              items: tabs
            })),
          React.createElement('section', { className: 'content', 'data-boss-shell': 'content' },
            React.createElement('section', { className: 'query-panel' },
              React.createElement(Form, {
                form,
                layout: 'inline',
                initialValues: {
                  status: 'all',
                  payMethod: 'all',
                  tradeTime: [dayjs().subtract(7, 'day'), dayjs()]
                },
                colon: true
              }, React.createElement('div', { className: 'query-grid', 'data-boss-query-grid': '3' },
                queryFields.map(field => React.createElement(React.Fragment, { key: field.key }, field.node)),
                React.createElement('div', { className: 'query-actions', 'data-boss-query-actions': true },
                  shouldShowQueryToggle && React.createElement(Button, { type: 'text', className: 'query-toggle' }, '收 起'),
                  React.createElement(Button, { onClick: resetQuery }, '重 置'),
                  React.createElement(Button, { type: 'primary', loading, onClick: doQuery }, '查 询'))))),
            React.createElement('section', { className: 'table-panel', 'data-boss-table-module': true },
              React.createElement('div', { className: 'query-summary', 'data-boss-query-summary': true },
                stats.map(item => React.createElement('div', { className: 'summary-card', key: item.label },
                  React.createElement(Statistic, { title: item.label, value: item.value })))) ,
              React.createElement('div', { className: 'toolbar' },
                React.createElement('div', { className: 'toolbar-title' }, '查询列表'),
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
                  scroll: { x: 1360 },
                  locale: { emptyText: React.createElement(Empty, { description: '暂无符合条件的交易流水' }) }
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
            React.createElement('footer', { className: 'page-footer' }, '© 2026 易宝支付有限公司 版权所有'))))),
    React.createElement(Drawer, {
      title: React.createElement('div', { className: 'drawer-title-bar' },
        React.createElement('span', { className: 'drawer-title-text' }, '交易流水详情'),
        React.createElement(Button, {
          className: 'drawer-title-close',
          type: 'text',
          icon: React.createElement(CloseOutlined, null),
          onClick: () => setDrawerOpen(false)
        })),
      width: 760,
      open: drawerOpen,
      onClose: () => setDrawerOpen(false),
      closable: false,
      footer: React.createElement(Space, { style: { display: 'flex', justifyContent: 'flex-end' } },
        React.createElement(Button, { onClick: () => setDrawerOpen(false) }, '取 消'),
        React.createElement(Button, { onClick: () => downloadVoucher(selectedRow) }, '下载凭证'),
        React.createElement(Button, { type: 'primary', onClick: () => startRefund(selectedRow) }, '发起退款'))
    },
      React.createElement('div', { className: 'drawer-section' },
        React.createElement('div', { className: 'drawer-section-title' }, '交易信息'),
        React.createElement(Descriptions, { column: 3, size: 'small' },
          React.createElement(Descriptions.Item, { label: '订单号' }, selectedRow?.orderNo),
          React.createElement(Descriptions.Item, { label: '交易状态' }, selectedRow?.statusText),
          React.createElement(Descriptions.Item, { label: '交易时间' }, selectedRow?.tradeTime),
          React.createElement(Descriptions.Item, { label: '支付方式' }, selectedRow?.payMethod),
          React.createElement(Descriptions.Item, { label: '交易金额(元)' }, selectedRow?.amount),
          React.createElement(Descriptions.Item, { label: '退款金额(元)' }, selectedRow?.refundAmount))),
      React.createElement('div', { className: 'drawer-section' },
        React.createElement('div', { className: 'drawer-section-title' }, '商户信息'),
        React.createElement(Descriptions, { column: 3, size: 'small' },
          React.createElement(Descriptions.Item, { label: '商户编号' }, selectedRow?.merchantNo),
          React.createElement(Descriptions.Item, { label: '商户名称' }, selectedRow?.merchantName),
          React.createElement(Descriptions.Item, { label: '凭证状态' }, selectedRow?.voucherStatus))),
      React.createElement('div', { className: 'drawer-section' },
        React.createElement('div', { className: 'drawer-section-title' }, '处理信息'),
        React.createElement(Descriptions, { column: 3, size: 'small' },
          React.createElement(Descriptions.Item, { label: '交易渠道流水号' }, `CH${selectedRow?.orderNo || ''}`),
          React.createElement(Descriptions.Item, { label: '入账状态' }, selectedRow?.status === 'success' ? '已入账' : '未入账'),
          React.createElement(Descriptions.Item, { label: '完成时间' }, selectedRow?.status === 'success' ? selectedRow?.tradeTime : '-')))));
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
  }, React.createElement(App, null, React.createElement(TransactionFlowPage, null)));
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Root, null));
