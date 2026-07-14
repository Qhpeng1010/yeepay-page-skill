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
  Timeline,
  Tooltip,
  message
} = antd;

const AntIcons = window.icons || window.antdIcons || window.AntDesignIcons || {};
const {
  BankOutlined,
  CloseOutlined,
  DownOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  ToolOutlined,
  UpOutlined
} = AntIcons;

dayjs.locale('zh-cn');
const { RangePicker } = DatePicker;

const rows = [
  {
    key: 'STORE20260710001',
    storeNo: 'ST10023981',
    storeName: '海川科技徐汇旗舰店',
    customerNo: 'C100800908',
    customerName: '上海海川科技有限公司',
    businessType: '数码零售',
    region: '上海市 / 徐汇区',
    manager: '赵晨',
    status: 'active',
    statusText: '营业中',
    createdTime: '2026-07-08 09:32:10'
  },
  {
    key: 'STORE20260709018',
    storeNo: 'ST10022873',
    storeName: '云桥服务西湖店',
    customerNo: 'C100800712',
    customerName: '杭州云桥信息服务有限公司',
    businessType: '生活服务',
    region: '浙江省 / 杭州市',
    manager: '李敏',
    status: 'pending',
    statusText: '待完善',
    createdTime: '2026-07-07 16:15:48'
  },
  {
    key: 'STORE20260709011',
    storeNo: 'ST10021106',
    storeName: '星澜餐饮朝阳门店',
    customerNo: 'C100800566',
    customerName: '北京星澜餐饮管理有限公司',
    businessType: '餐饮',
    region: '北京市 / 朝阳区',
    manager: '王磊',
    status: 'active',
    statusText: '营业中',
    createdTime: '2026-07-07 11:02:33'
  },
  {
    key: 'STORE20260708027',
    storeNo: 'ST10019852',
    storeName: '嘉汇贸易前海店',
    customerNo: 'C100800431',
    customerName: '深圳前海嘉汇贸易有限公司',
    businessType: '跨境贸易',
    region: '广东省 / 深圳市',
    manager: '周宇',
    status: 'frozen',
    statusText: '已冻结',
    createdTime: '2026-07-06 18:45:22'
  },
  {
    key: 'STORE20260708019',
    storeNo: 'ST10018736',
    storeName: '南湾酒店天河店',
    customerNo: 'C100800325',
    customerName: '广州南湾酒店管理有限公司',
    businessType: '酒店住宿',
    region: '广东省 / 广州市',
    manager: '陈洁',
    status: 'active',
    statusText: '营业中',
    createdTime: '2026-07-06 14:21:09'
  },
  {
    key: 'STORE20260707042',
    storeNo: 'ST10017620',
    storeName: '锦里文旅宽窄巷店',
    customerNo: 'C100800219',
    customerName: '成都锦里文旅服务有限公司',
    businessType: '文旅服务',
    region: '四川省 / 成都市',
    manager: '刘佳',
    status: 'inactive',
    statusText: '已停业',
    createdTime: '2026-07-05 17:08:56'
  },
  {
    key: 'STORE20260707031',
    storeNo: 'ST10016388',
    storeName: '云栖零售鼓楼店',
    customerNo: 'C100800108',
    customerName: '南京云栖零售有限公司',
    businessType: '便利零售',
    region: '江苏省 / 南京市',
    manager: '孙悦',
    status: 'pending',
    statusText: '待完善',
    createdTime: '2026-07-05 10:36:44'
  },
  {
    key: 'STORE20260706028',
    storeNo: 'ST10015219',
    storeName: '港湾供应链滨海店',
    customerNo: 'C100799982',
    customerName: '天津港湾供应链有限公司',
    businessType: '供应链',
    region: '天津市 / 滨海新区',
    manager: '郭宁',
    status: 'active',
    statusText: '营业中',
    createdTime: '2026-07-04 15:19:27'
  }
];

function StatusDot({ status, text }) {
  const cls = status === 'active' ? 'success' : status === 'pending' ? 'warning' : status === 'frozen' ? 'error' : 'default';
  return React.createElement('span', { className: `status-dot ${cls}` }, text);
}

function CustomerStorePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(rows[0]);
  const [collapsed, setCollapsed] = React.useState(false);
  const [openKeys, setOpenKeys] = React.useState(['customerStore']);
  const [activeTab, setActiveTab] = React.useState('customerStore');
  const [queryExpanded, setQueryExpanded] = React.useState(false);
  const [visibleColumnKeys, setVisibleColumnKeys] = React.useState([
    'storeNo',
    'storeName',
    'customerNo',
    'customerName',
    'businessType',
    'region',
    'status',
    'manager',
    'createdTime',
    'actions'
  ]);

  const queryFields = [
    {
      key: 'customerNo',
      node: React.createElement(Form.Item, { label: '客户编号', name: 'customerNo' },
        React.createElement(Input, { placeholder: '请输入客户编号', allowClear: true }))
    },
    {
      key: 'customerName',
      node: React.createElement(Form.Item, { label: '客户名称', name: 'customerName' },
        React.createElement(Input, { placeholder: '请输入客户名称', allowClear: true }))
    },
    {
      key: 'storeNo',
      node: React.createElement(Form.Item, { label: '门店编号', name: 'storeNo' },
        React.createElement(Input, { placeholder: '请输入门店编号', allowClear: true }))
    },
    {
      key: 'storeName',
      node: React.createElement(Form.Item, { label: '门店名称', name: 'storeName' },
        React.createElement(Input, { placeholder: '请输入门店名称', allowClear: true }))
    },
    {
      key: 'status',
      node: React.createElement(Form.Item, { label: '门店状态', name: 'status' },
        React.createElement(Select, {
          placeholder: '请选择门店状态',
          options: [
            { label: '全部', value: 'all' },
            { label: '营业中', value: 'active' },
            { label: '待完善', value: 'pending' },
            { label: '已冻结', value: 'frozen' },
            { label: '已停业', value: 'inactive' }
          ]
        }))
    },
    {
      key: 'region',
      node: React.createElement(Form.Item, { label: '所属地区', name: 'region' },
        React.createElement(Select, {
          placeholder: '请选择所属地区',
          options: [
            { label: '全部', value: 'all' },
            { label: '上海市', value: 'shanghai' },
            { label: '北京市', value: 'beijing' },
            { label: '广东省', value: 'guangdong' },
            { label: '浙江省', value: 'zhejiang' },
            { label: '四川省', value: 'sichuan' }
          ]
        }))
    },
    {
      key: 'businessType',
      node: React.createElement(Form.Item, { label: '经营类型', name: 'businessType' },
        React.createElement(Select, {
          placeholder: '请选择经营类型',
          options: [
            { label: '全部', value: 'all' },
            { label: '餐饮', value: 'catering' },
            { label: '便利零售', value: 'retail' },
            { label: '酒店住宿', value: 'hotel' },
            { label: '生活服务', value: 'service' },
            { label: '供应链', value: 'supplyChain' }
          ]
        }))
    },
    {
      key: 'createdTime',
      node: React.createElement(Form.Item, { label: '创建时间', name: 'createdTime' },
        React.createElement(RangePicker, {
          style: { width: '100%' },
          placeholder: ['请选择开始日期', '请选择结束日期']
        }))
    }
  ];

  const visibleQueryFields = queryExpanded ? queryFields : queryFields.slice(0, 5);
  const shouldShowQueryToggle = queryFields.length > 6;

  const openDrawer = record => {
    setSelectedRow(record);
    setDrawerOpen(true);
  };

  const editStore = record => {
    setSelectedRow(record);
    message.success(`已选择 ${record.storeName}，可进入编辑流程`);
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
    { title: '门店编号', dataIndex: 'storeNo', key: 'storeNo', width: 128 },
    { title: '门店名称', dataIndex: 'storeName', key: 'storeName', width: 180, ellipsis: true },
    { title: '客户编号', dataIndex: 'customerNo', key: 'customerNo', width: 128 },
    { title: '客户名称', dataIndex: 'customerName', key: 'customerName', width: 210, ellipsis: true },
    { title: '经营类型', dataIndex: 'businessType', key: 'businessType', width: 108 },
    { title: '所属地区', dataIndex: 'region', key: 'region', width: 150 },
    {
      title: '门店状态',
      dataIndex: 'statusText',
      key: 'status',
      width: 110,
      render: (_, record) => React.createElement(StatusDot, { status: record.status, text: record.statusText })
    },
    { title: '负责人', dataIndex: 'manager', key: 'manager', width: 96 },
    { title: '创建时间', dataIndex: 'createdTime', key: 'createdTime', width: 168 },
    {
      title: '操作',
      key: 'actions',
      width: 136,
      fixed: 'right',
      className: 'operation-column',
      render: (_, record) => React.createElement('div', { className: 'operation-buttons' },
        React.createElement(Button, { type: 'link', onClick: () => openDrawer(record) }, '查看详情'),
        React.createElement(Button, { type: 'link', className: 'secondary-action', onClick: () => editStore(record) }, '编辑'))
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
    { key: 'customerStore', title: '客户门店查询', closable: true },
    { key: 'operator', title: '操作员管理', closable: true }
  ].map(item => ({
    key: item.key,
    closable: item.closable,
    label: React.createElement(Tooltip, { title: item.title.length > 6 ? item.title : '' },
      React.createElement('span', { className: 'tab-label' },
        activeTab === item.key && React.createElement(ReloadOutlined, null),
        React.createElement('span', { className: 'tab-title' }, item.title)))
  }));

  const menuItems = [
    {
      key: 'customerStore',
      icon: React.createElement(ShopOutlined, null),
      label: '客户门店',
      children: [
        { key: 'customer-store', label: '客户门店查询' },
        { key: 'customer-info', label: '客户资料管理' },
        { key: 'store-config', label: '门店配置管理' }
      ]
    },
    { key: 'merchant', icon: React.createElement(TeamOutlined, null), label: '商户资料' },
    { key: 'account', icon: React.createElement(BankOutlined, null), label: '资金账户' },
    { key: 'config', icon: React.createElement(ToolOutlined, null), label: '配置管理' },
    { key: 'risk', icon: React.createElement(SafetyCertificateOutlined, null), label: '风控审核' }
  ];

  return React.createElement('div', { className: 'boss-page' },
    React.createElement('div', { className: 'topbar' },
      React.createElement('div', null, '上次登录时间：2026-07-10 09:18:32　登录 IP：10.24.18.66'),
      React.createElement('div', null, '10080090899 · Boss Ledger 客户门店后台　帮助中心　消息')),
    React.createElement('header', { className: 'primary-nav' },
      React.createElement('div', { className: 'logo-zone' },
        React.createElement('img', { className: 'logo', src: './assets/boss-ledger-logo.svg', alt: '老板管账' })),
      React.createElement('nav', { className: 'primary-items' },
        React.createElement('div', { className: 'primary-item' }, '首页'),
        React.createElement('div', { className: 'primary-item' }, '数据报表'),
        React.createElement('div', { className: 'primary-item active' }, '客户管理'),
        React.createElement('div', { className: 'primary-item' }, '资金管理'),
        React.createElement('div', { className: 'primary-item' }, '对账管理'),
        React.createElement('div', { className: 'primary-item' }, '系统管理'))),
    React.createElement('div', { className: 'shell' },
      React.createElement('aside', { className: `sider ${collapsed ? 'collapsed' : ''}` },
        React.createElement('div', { className: 'sider-menu' },
          React.createElement(Menu, {
            mode: 'inline',
            inlineCollapsed: collapsed,
            inlineCollapsedWidth: 48,
            selectedKeys: ['customer-store'],
            openKeys: collapsed ? [] : openKeys,
            onOpenChange: setOpenKeys,
            items: menuItems
          })),
        React.createElement('div', { className: 'collapse-control', onClick: () => setCollapsed(!collapsed) },
          collapsed ? React.createElement(MenuUnfoldOutlined, null) : React.createElement(MenuFoldOutlined, null))),
      React.createElement('main', { className: 'workspace' },
        React.createElement('div', { className: 'work-body' },
          React.createElement('div', { className: 'tab-strip' },
            React.createElement(Tabs, {
              className: 'boss-tabs',
              type: 'editable-card',
              hideAdd: true,
              activeKey: activeTab,
              onChange: setActiveTab,
              items: tabs
            })),
          React.createElement('section', { className: 'content' },
            React.createElement('section', { className: 'query-panel' },
              React.createElement(Form, {
                form,
                layout: 'inline',
                initialValues: {
                  status: 'active',
                  createdTime: [dayjs().subtract(30, 'day'), dayjs()]
                },
                colon: true
              }, React.createElement('div', { className: 'query-grid' },
                visibleQueryFields.map(field => React.createElement(React.Fragment, { key: field.key }, field.node)),
                React.createElement('div', { className: 'query-actions' },
                  shouldShowQueryToggle && React.createElement(Button, {
                    className: 'query-toggle',
                    type: 'text',
                    icon: queryExpanded ? React.createElement(UpOutlined, null) : React.createElement(DownOutlined, null),
                    onClick: () => setQueryExpanded(!queryExpanded)
                  }, queryExpanded ? '收 起' : '展 开'),
                  React.createElement(Button, { onClick: resetQuery }, '重 置'),
                  React.createElement(Button, { type: 'primary', loading, onClick: doQuery }, '查 询'))))),
            React.createElement('section', { className: 'table-panel' },
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
                  scroll: { x: 1320 },
                  locale: { emptyText: React.createElement(Empty, { description: '暂无符合条件的客户门店' }) }
                }),
                React.createElement('div', { className: 'table-pagination' },
                  React.createElement(Pagination, {
                    current: 1,
                    pageSize: 10,
                    showSizeChanger: { getPopupContainer: () => document.body },
                    pageSizeOptions: [10, 20, 50, 100],
                    locale: { items_per_page: '条/页', jump_to: '跳至', page: '页' },
                    total: 56,
                    showTotal: total => `共 ${total} 条`
                  }))),
              React.createElement('div', { className: 'table-fill' })),
            React.createElement('footer', { className: 'page-footer' }, '© 2026 易宝支付有限公司 版权所有'))))),
    React.createElement(Drawer, {
      title: React.createElement('div', { className: 'drawer-title-bar' },
        React.createElement('span', { className: 'drawer-title-text' }, '客户门店详情'),
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
        React.createElement(Button, { type: 'primary', onClick: () => editStore(selectedRow) }, '编 辑'))
    },
      React.createElement('div', { className: 'drawer-section' },
        React.createElement('div', { className: 'drawer-section-title' }, '客户信息'),
        React.createElement(Descriptions, { column: 3, size: 'small' },
          React.createElement(Descriptions.Item, { label: '客户编号' }, selectedRow?.customerNo),
          React.createElement(Descriptions.Item, { label: '客户名称' }, selectedRow?.customerName),
          React.createElement(Descriptions.Item, { label: '经营类型' }, selectedRow?.businessType))),
      React.createElement('div', { className: 'drawer-section' },
        React.createElement('div', { className: 'drawer-section-title' }, '门店信息'),
        React.createElement(Descriptions, { column: 3, size: 'small' },
          React.createElement(Descriptions.Item, { label: '门店编号' }, selectedRow?.storeNo),
          React.createElement(Descriptions.Item, { label: '门店名称' }, selectedRow?.storeName),
          React.createElement(Descriptions.Item, { label: '门店状态' }, selectedRow?.statusText),
          React.createElement(Descriptions.Item, { label: '所属地区' }, selectedRow?.region),
          React.createElement(Descriptions.Item, { label: '负责人' }, selectedRow?.manager),
          React.createElement(Descriptions.Item, { label: '创建时间' }, selectedRow?.createdTime))),
      React.createElement('div', { className: 'drawer-section' },
        React.createElement('div', { className: 'drawer-section-title' }, '结算与终端'),
        React.createElement(Descriptions, { column: 3, size: 'small' },
          React.createElement(Descriptions.Item, { label: '结算主体' }, selectedRow?.customerName),
          React.createElement(Descriptions.Item, { label: '终端数量' }, '6 台'),
          React.createElement(Descriptions.Item, { label: '最近交易' }, '2026-07-10 08:41:26'))),
      React.createElement('div', { className: 'drawer-section' },
        React.createElement('div', { className: 'drawer-section-title' }, '操作记录'),
        React.createElement(Timeline, {
          items: [
            { color: 'blue', children: `${selectedRow?.createdTime || '-'} 创建门店资料` },
            { color: 'green', children: `${selectedRow?.manager || '-'} 最近维护门店信息` }
          ]
        }))));
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
  }, React.createElement(App, null, React.createElement(CustomerStorePage, null)));
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Root, null));
