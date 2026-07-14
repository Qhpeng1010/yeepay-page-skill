const App = antd.App;
const Button = antd.Button;
const Checkbox = antd.Checkbox;
const ConfigProvider = antd.ConfigProvider;
const DatePicker = antd.DatePicker;
const Descriptions = antd.Descriptions;
const Drawer = antd.Drawer;
const Dropdown = antd.Dropdown;
const Empty = antd.Empty;
const Form = antd.Form;
const Input = antd.Input;
const Menu = antd.Menu;
const Modal = antd.Modal;
const Pagination = antd.Pagination;
const Select = antd.Select;
const Space = antd.Space;
const Statistic = antd.Statistic;
const Table = antd.Table;
const Tabs = antd.Tabs;
const Tooltip = antd.Tooltip;
const message = antd.message;
const AntIcons = window.icons || window.antdIcons || window.AntDesignIcons || {};
const CloseOutlined = AntIcons.CloseOutlined;
const DashboardOutlined = AntIcons.DashboardOutlined;
const DownOutlined = AntIcons.DownOutlined;
const FileTextOutlined = AntIcons.FileTextOutlined;
const FullscreenOutlined = AntIcons.FullscreenOutlined;
const MenuFoldOutlined = AntIcons.MenuFoldOutlined;
const MenuUnfoldOutlined = AntIcons.MenuUnfoldOutlined;
const NotificationOutlined = AntIcons.NotificationOutlined;
const OrderedListOutlined = AntIcons.OrderedListOutlined;
const ReloadOutlined = AntIcons.ReloadOutlined;
const ScheduleOutlined = AntIcons.ScheduleOutlined;
const SettingOutlined = AntIcons.SettingOutlined;
const SwapOutlined = AntIcons.SwapOutlined;
const UpOutlined = AntIcons.UpOutlined;

dayjs.locale('zh-cn');

const RangePicker = DatePicker.RangePicker;

const sections = [
  { key: 'overview', label: '航旅经营总览' },
  { key: 'orders', label: '机票订单运维管理' },
  { key: 'refund', label: '退改签管理' },
  { key: 'reconcile', label: '渠道对账管理' },
  { key: 'policy', label: '机票政策管理' },
  { key: 'system', label: '系统管理' },
];

const menuBySection = {
  overview: [
    {
      key: 'travel-overview',
      icon: <DashboardOutlined />,
      label: '航旅经营总览',
      children: [
        { key: 'flight-dashboard', label: '航旅数据大盘首页' },
        { key: 'route-profit', label: '航线利润分析' },
        { key: 'channel-board', label: '渠道经营分析' },
      ],
    },
    {
      key: 'risk-todo',
      icon: <ScheduleOutlined />,
      label: '业务待办',
      children: [
        { key: 'refund-audit', label: '退票审核待办' },
        { key: 'pnr-patch', label: 'PNR 补录处理' },
      ],
    },
  ],
  orders: [
    {
      key: 'ticket-order',
      icon: <OrderedListOutlined />,
      label: '机票订单运维',
      children: [
        { key: 'all-orders', label: '全部机票订单列表' },
        { key: 'manual-ticket', label: '人工出票队列' },
        { key: 'flight-change', label: '航班异动订单' },
      ],
    },
    {
      key: 'trip-doc',
      icon: <FileTextOutlined />,
      label: '行程单管理',
      children: [
        { key: 'trip-print', label: '行程单打印' },
        { key: 'trip-reissue', label: '行程单补发' },
      ],
    },
  ],
};

const tabsByPage = {
  overview: [
    { key: 'flight-dashboard', title: '航旅数据大盘首页' },
    { key: 'route-profit', title: '航线利润分析' },
    { key: 'channel-board', title: '渠道经营分析' },
  ],
  orders: [
    { key: 'all-orders', title: '全部机票订单列表' },
    { key: 'manual-ticket', title: '人工出票队列' },
    { key: 'flight-change', title: '航班异动订单' },
  ],
};

const flightMetrics = [
  { label: '出票量', value: '36,842', extra: '环比 +9.8%' },
  { label: '退改率', value: '7.46%', extra: '环比 -0.6%' },
  { label: '平台毛利润(元)', value: '428,916.32', extra: '环比 +12.4%' },
  { label: '客单价(元)', value: '1,024.18', extra: '环比 +4.2%' },
];

const ticketTrend = [
  { date: '07-04', 出票量: 3980, 交易额: 385 },
  { date: '07-05', 出票量: 4260, 交易额: 416 },
  { date: '07-06', 出票量: 4610, 交易额: 438 },
  { date: '07-07', 出票量: 4890, 交易额: 492 },
  { date: '07-08', 出票量: 5310, 交易额: 536 },
  { date: '07-09', 出票量: 5720, 交易额: 604 },
  { date: '07-10', 出票量: 6072, 交易额: 648 },
];

const channelShare = [
  { type: '自营小程序', value: 35 },
  { type: 'OTA 分销', value: 28 },
  { type: '企业差旅', value: 19 },
  { type: '代理商', value: 12 },
  { type: '呼叫中心', value: 6 },
];

const regionRevenue = [
  { type: '国内航线', value: 64 },
  { type: '国际航线', value: 36 },
];

const routeRanking = [
  { name: '上海虹桥 - 深圳宝安', value: 186.4 },
  { name: '北京首都 - 成都天府', value: 172.8 },
  { name: '广州白云 - 杭州萧山', value: 158.6 },
  { name: '上海浦东 - 东京成田', value: 145.9 },
  { name: '北京大兴 - 新加坡樟宜', value: 132.5 },
  { name: '成都天府 - 三亚凤凰', value: 119.2 },
  { name: '深圳宝安 - 曼谷素万那普', value: 108.7 },
  { name: '杭州萧山 - 香港国际', value: 96.1 },
];

const policyRanking = [
  { name: '南航国内公务舱返佣政策', value: 19.8 },
  { name: '东航华东商旅协议价', value: 17.6 },
  { name: '国航国际联程奖励', value: 15.2 },
  { name: '海航暑期经济舱政策', value: 12.9 },
  { name: '川航高毛利中转政策', value: 10.6 },
  { name: '深航企业客户专享价', value: 8.8 },
];

const todos = [
  { name: '待审核退票单', count: 128 },
  { name: '待补录 PNR 订单', count: 46 },
  { name: '待对账渠道账单', count: 19 },
  { name: '航班异动待处理工单', count: 72 },
];

const orderRows = [
  {
    key: 'FT202607100001',
    orderNo: 'FT202607100001',
    pnr: 'J8P2KQ',
    airline: 'MU5137',
    route: '上海虹桥 SHA - 北京首都 PEK',
    time: '2026-07-12 08:35 / 10:55',
    cabin: '经济舱 Y',
    passenger: '张航 / 成人',
    fare: 1280,
    tax: 120,
    status: 'pending',
    statusText: '待出票',
    channel: '自营小程序',
  },
  {
    key: 'FT202607100002',
    orderNo: 'FT202607100002',
    pnr: 'N7L4RT',
    airline: 'CZ3155',
    route: '广州白云 CAN - 成都天府 TFU',
    time: '2026-07-12 13:20 / 15:35',
    cabin: '经济舱 M',
    passenger: '李悦 / 成人',
    fare: 860,
    tax: 90,
    status: 'issued',
    statusText: '已出票',
    channel: 'OTA 分销',
  },
  {
    key: 'FT202607100003',
    orderNo: 'FT202607100003',
    pnr: 'B3Q8MD',
    airline: 'CA975',
    route: '北京首都 PEK - 新加坡 SIN',
    time: '2026-07-13 00:10 / 06:35',
    cabin: '公务舱 C',
    passenger: '王彦 / 成人',
    fare: 6280,
    tax: 530,
    status: 'changed',
    statusText: '已改签',
    channel: '企业差旅',
  },
  {
    key: 'FT202607100004',
    orderNo: 'FT202607100004',
    pnr: 'K9T6XA',
    airline: 'HO1295',
    route: '上海浦东 PVG - 曼谷 BKK',
    time: '2026-07-14 18:20 / 22:05',
    cabin: '经济舱 Q',
    passenger: '陈思 / 成人',
    fare: 2160,
    tax: 410,
    status: 'refunded',
    statusText: '已退票',
    channel: '代理商',
  },
  {
    key: 'FT202607100005',
    orderNo: 'FT202607100005',
    pnr: 'P2V5NC',
    airline: '3U8883',
    route: '成都天府 TFU - 三亚凤凰 SYX',
    time: '2026-07-15 09:40 / 12:15',
    cabin: '经济舱 H',
    passenger: '周宁 / 儿童',
    fare: 740,
    tax: 50,
    status: 'voided',
    statusText: '废票',
    channel: '呼叫中心',
  },
  {
    key: 'FT202607100006',
    orderNo: 'FT202607100006',
    pnr: 'M5D1WE',
    airline: 'ZH9108',
    route: '深圳宝安 SZX - 杭州萧山 HGH',
    time: '2026-07-15 21:05 / 23:10',
    cabin: '经济舱 B',
    passenger: '赵一鸣 / 成人',
    fare: 930,
    tax: 90,
    status: 'cancelled',
    statusText: '航班取消',
    channel: '企业差旅',
  },
];

const summaryStats = [
  { title: '总订单数(单)', value: 128436 },
  { title: '成功出票数(单)', value: 119862 },
  { title: '退票单数(单)', value: 4386 },
  { title: '改期单数(单)', value: 2861 },
  { title: '废票数量(单)', value: 739 },
  { title: '总成交金额(元)', value: 38629180.46, precision: 2 },
];

function PlatformChart(props) {
  const type = props.type;
  const config = props.config;
  const className = props.className || 'chart-box';
  const ref = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    const charts = window.G2Plot || {};
    const ChartCtor = charts[type];
    if (!ChartCtor || !ref.current) return undefined;
    if (chartRef.current && chartRef.current.destroy) chartRef.current.destroy();

    const baseConfig = Object.assign({
      autoFit: true,
      animation: false,
      appendPadding: 8,
      color: ['#F36046', '#1677FF', '#52C41A', '#FAAD14', '#722ED1', '#13C2C2'],
      legend: { position: 'top' },
    }, config);

    chartRef.current = new ChartCtor(ref.current, baseConfig);
    chartRef.current.render();

    return () => {
      if (chartRef.current && chartRef.current.destroy) chartRef.current.destroy();
    };
  }, [type, JSON.stringify(config)]);

  return <div className={className} ref={ref} />;
}

function StatusDot(props) {
  const status = props.status;
  const text = props.text;
  const cls = status === 'pending' ? 'warning' : status === 'issued' ? 'success' : status === 'cancelled' ? 'error' : status === 'changed' ? 'processing' : status;
  return <span className={`status-dot ${cls}`}>{text}</span>;
}

function ShellTabs(props) {
  const activePage = props.activePage;
  const setActivePage = props.setActivePage;
  const items = tabsByPage[activePage].map((item) => ({
    key: item.key,
    label: (
      <Tooltip title={item.title.length > 6 ? item.title : ''}>
        <span className="tab-label">
          <ReloadOutlined data-boss-tab-static-icon />
          <span className="tab-title">{item.title}</span>
          <CloseOutlined />
        </span>
      </Tooltip>
    ),
  }));

  const activeKey = activePage === 'overview' ? 'flight-dashboard' : 'all-orders';

  return (
    <div className="tabs-area" data-boss-shell="tabs">
      <Tabs
        type="card"
        activeKey={activeKey}
        items={items}
        onChange={(key) => {
          if (key === 'all-orders') setActivePage('orders');
          if (key === 'flight-dashboard') setActivePage('overview');
        }}
      />
    </div>
  );
}

function DashboardFilter() {
  return (
    <section className="filter-bar" data-boss-query-grid="3">
      <div className="query-grid">
        <div className="filter-left">
          <Select defaultValue="all" placeholder="请选择航线类型" options={[
            { value: 'all', label: '全部航线类型' },
            { value: 'oneway', label: '单程' },
            { value: 'round', label: '往返' },
            { value: 'multi', label: '多程' },
          ]} />
          <Select defaultValue="all" placeholder="请选择国内国际" options={[
            { value: 'all', label: '全部航线范围' },
            { value: 'domestic', label: '国内' },
            { value: 'international', label: '国际' },
          ]} />
          <Select className="channel-select" defaultValue="all" placeholder="请选择渠道" options={[
            { value: 'all', label: '全部渠道' },
            { value: 'mini', label: '自营小程序' },
            { value: 'ota', label: 'OTA 分销' },
            { value: 'corp', label: '企业差旅' },
          ]} />
        </div>
        <div />
        <div className="filter-right">
          <div className="quick-ranges">
            <span>今日</span>
            <span className="active">近7日</span>
            <span>近30日</span>
          </div>
          <RangePicker defaultValue={[dayjs('2026-07-04'), dayjs('2026-07-10')]} placeholder={['请选择开始日期', '请选择结束日期']} />
          <Tooltip title="全屏查看">
            <FullscreenOutlined style={{ color: '#4E5969', cursor: 'pointer' }} />
          </Tooltip>
        </div>
      </div>
    </section>
  );
}

function FlightSummaryCard() {
  return (
    <section className="summary-card">
      <div className="module-title-row">
        <div className="module-title">经营指标概览</div>
      </div>
      <div className="summary-content">
        <div className="primary-metric">
          <div className="metric-label">当期机票总交易额(元)</div>
          <div className="metric-value">37,729,640.80</div>
          <div className="trend-line">
            <span>环比</span>
            <span className="trend-up">+11.8%</span>
            <span>昨日</span>
            <span className="trend-up">+6.2%</span>
          </div>
        </div>
        <div className="summary-grid">
          {flightMetrics.map((item) => (
            <div className="stat-tile" key={item.label}>
              <div className="metric-label">{item.label}</div>
              <div className="stat-value">{item.value}</div>
              <div className={item.extra.includes('-') ? 'stat-extra trend-down' : 'stat-extra trend-up'}>{item.extra}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DistributionCard() {
  return (
    <section className="distribution-card">
      <div className="module-title-row">
        <div className="module-title">出票与营收占比</div>
        <div className="module-tabs">
          <span className="active">渠道</span>
          <span>国内/国际</span>
        </div>
      </div>
      <PlatformChart
        type="Pie"
        config={{
          data: channelShare,
          angleField: 'value',
          colorField: 'type',
          radius: 0.82,
          innerRadius: 0.58,
          statistic: false,
          label: false,
          legend: { position: 'bottom' },
        }}
      />
    </section>
  );
}

function TrendCard() {
  return (
    <section className="trend-card">
      <div className="module-title-row">
        <div className="module-title">出票量 & 交易额趋势</div>
        <div className="chart-note">交易额单位：万元</div>
      </div>
      <PlatformChart
        type="DualAxes"
        className="chart-box small-chart"
        config={{
          data: [ticketTrend, ticketTrend],
          xField: 'date',
          yField: ['出票量', '交易额'],
          geometryOptions: [
            { geometry: 'column', color: '#F36046', columnWidthRatio: 0.42 },
            { geometry: 'line', color: '#1677FF', smooth: true },
          ],
          yAxis: {
            tickets: { title: { text: '出票量' } },
            amount: { title: { text: '交易额' } },
          },
        }}
      />
    </section>
  );
}

function RegionCard() {
  return (
    <section className="trend-card">
      <div className="module-title-row">
        <div className="module-title">国内 / 国际航线营收占比</div>
        <div className="chart-note">按实收票款统计</div>
      </div>
      <PlatformChart
        type="Pie"
        className="chart-box small-chart"
        config={{
          data: regionRevenue,
          angleField: 'value',
          colorField: 'type',
          radius: 0.8,
          label: { type: 'inner', content: '{percentage}' },
          legend: { position: 'bottom' },
        }}
      />
    </section>
  );
}

function RankingCard(props) {
  const title = props.title;
  const data = props.data;
  const note = props.note;
  return (
    <section className="rank-card">
      <div className="module-title-row">
        <div className="module-title">{title}</div>
        <div className="chart-note">{note}</div>
      </div>
      <PlatformChart
        type="Bar"
        className="chart-box rank-chart"
        config={{
          data,
          xField: 'value',
          yField: 'name',
          seriesField: 'name',
          legend: false,
          barWidthRatio: 0.52,
          color: '#F36046',
          label: { position: 'right', formatter: (item) => `${item.value}` },
        }}
      />
    </section>
  );
}

function TodoCard() {
  return (
    <section className="todo-card">
      <div className="module-title-row">
        <div className="module-title">业务待办</div>
        <div className="chart-note">按当前运营组权限统计</div>
      </div>
      <div className="todo-list">
        {todos.map((item) => (
          <div className="todo-item" key={item.name}>
            <span className="todo-name">{item.name}</span>
            <span className="todo-count">{item.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardContent() {
  return (
    <main className="content-scroll" data-boss-shell="content">
      <div className="dashboard">
        <DashboardFilter />
        <div className="top-row">
          <FlightSummaryCard />
          <DistributionCard />
        </div>
        <div className="bottom-row">
          <TrendCard />
          <RegionCard />
          <TodoCard />
        </div>
        <div className="bottom-row">
          <RankingCard title="热门航线营收排行" data={routeRanking} note="单位：万元" />
          <RankingCard title="高利润机票政策排行" data={policyRanking} note="单位：万元" />
          <TodoCard />
        </div>
        <footer className="footer">© 2026 易宝支付有限公司 版权所有</footer>
      </div>
    </main>
  );
}

function OrderQueryPanel(props) {
  const form = props.form;
  const loading = props.loading;
  const onQuery = props.onQuery;
  const onReset = props.onReset;
  const expandedState = React.useState(false);
  const expanded = expandedState[0];
  const setExpanded = expandedState[1];
  const fields = [
    <Form.Item label="订单状态" name="status" key="status"><Select placeholder="请选择订单状态" options={[
      { label: '待出票', value: 'pending' },
      { label: '已出票', value: 'issued' },
      { label: '已改签', value: 'changed' },
      { label: '已退票', value: 'refunded' },
      { label: '废票', value: 'voided' },
      { label: '航班取消', value: 'cancelled' },
    ]} /></Form.Item>,
    <Form.Item label="航线类型" name="routeType" key="routeType"><Select placeholder="请选择航线类型" options={[
      { label: '单程', value: 'oneway' },
      { label: '往返', value: 'round' },
      { label: '多程', value: 'multi' },
    ]} /></Form.Item>,
    <Form.Item label="航司" name="airline" key="airline"><Input placeholder="请输入航司二字码或名称" allowClear /></Form.Item>,
    <Form.Item label="起降日期" name="flightDate" key="flightDate"><RangePicker placeholder={['请选择开始日期', '请选择结束日期']} /></Form.Item>,
    <Form.Item label="乘客姓名" name="passenger" key="passenger"><Input placeholder="请输入乘客姓名" allowClear /></Form.Item>,
    <Form.Item label="订单号" name="orderNo" key="orderNo"><Input placeholder="请输入订单号" allowClear /></Form.Item>,
    <Form.Item label="PNR 编码" name="pnr" key="pnr"><Input placeholder="请输入 PNR 编码" allowClear /></Form.Item>,
    <Form.Item label="渠道" name="channel" key="channel"><Select placeholder="请选择渠道" options={[
      { label: '自营小程序', value: 'mini' },
      { label: 'OTA 分销', value: 'ota' },
      { label: '企业差旅', value: 'corp' },
      { label: '代理商', value: 'agent' },
      { label: '呼叫中心', value: 'call' },
    ]} /></Form.Item>,
  ];
  const visibleFields = expanded ? fields : fields.slice(0, 5);

  return (
    <section className="query-panel">
      <Form form={form} layout="inline" colon initialValues={{ status: 'pending', flightDate: [dayjs('2026-07-10'), dayjs('2026-07-17')] }}>
        <div className="query-grid" data-boss-query-grid="3">
          {visibleFields}
          <div className="query-actions" data-boss-query-actions>
            <Button className="query-toggle" type="text" icon={expanded ? <UpOutlined /> : <DownOutlined />} onClick={() => setExpanded(!expanded)}>
              {expanded ? '收 起' : '展 开'}
            </Button>
            <Button onClick={onReset}>重 置</Button>
            <Button type="primary" loading={loading} onClick={onQuery}>查 询</Button>
          </div>
        </div>
      </Form>
    </section>
  );
}

function OrderTablePage() {
  const formState = Form.useForm();
  const form = formState[0];
  const loadingState = React.useState(false);
  const loading = loadingState[0];
  const setLoading = loadingState[1];
  const drawerState = React.useState(false);
  const drawerOpen = drawerState[0];
  const setDrawerOpen = drawerState[1];
  const selectedState = React.useState(orderRows[0]);
  const selectedRow = selectedState[0];
  const setSelectedRow = selectedState[1];
  const columnState = React.useState(['orderNo', 'pnr', 'airline', 'route', 'time', 'cabin', 'passenger', 'fare', 'tax', 'status', 'actions']);
  const visibleColumnKeys = columnState[0];
  const setVisibleColumnKeys = columnState[1];

  const openDetail = (record) => {
    setSelectedRow(record);
    setDrawerOpen(true);
  };
  const doQuery = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('查询完成');
    }, 600);
  };
  const resetQuery = () => {
    form.resetFields();
    message.success('查询条件已重置');
  };
  const confirmAction = (title, content) => {
    Modal.confirm({
      title,
      content,
      okText: '确 认',
      cancelText: '取 消',
      onOk: () => message.success(`${title.replace('？', '')}已提交`),
    });
  };

  const moreRowItems = (record) => ({
    items: [
      { key: 'refund', label: '发起退票', onClick: () => confirmAction('确认发起退票？', `订单 ${record.orderNo} 将进入退票审核流程。`) },
      { key: 'void', label: '作废订单', onClick: () => confirmAction('确认作废订单？', `订单 ${record.orderNo} 作废后需记录操作原因。`) },
      { key: 'trip', label: '补发行程单', onClick: () => message.success('行程单补发任务已创建') },
      { key: 'sms', label: '发送航班通知短信', onClick: () => message.success('航班通知短信已发送') },
    ],
  });

  const baseColumns = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 150, fixed: 'left' },
    { title: 'PNR 编码', dataIndex: 'pnr', key: 'pnr', width: 100 },
    { title: '航司航班号', dataIndex: 'airline', key: 'airline', width: 110 },
    { title: '起降城市时间', dataIndex: 'route', key: 'route', width: 260, render: (_, record) => <div><div>{record.route}</div><div className="rank-meta">{record.time}</div></div> },
    { title: '舱位', dataIndex: 'cabin', key: 'cabin', width: 110 },
    { title: '乘客信息', dataIndex: 'passenger', key: 'passenger', width: 130 },
    { title: '票价(元)', dataIndex: 'fare', key: 'fare', width: 110, align: 'right', render: (value) => value.toLocaleString('zh-CN') },
    { title: '税费(元)', dataIndex: 'tax', key: 'tax', width: 100, align: 'right', render: (value) => value.toLocaleString('zh-CN') },
    { title: '订单状态', dataIndex: 'statusText', key: 'status', width: 120, render: (_, record) => <StatusDot status={record.status} text={record.statusText} /> },
    {
      title: '操作',
      key: 'actions',
      width: 230,
      fixed: 'right',
      render: (_, record) => (
        <div className="operation-buttons">
          <Button type="link" onClick={() => openDetail(record)}>查看订单详情</Button>
          <Button type="link" onClick={() => message.success('人工出票任务已派发')}>人工出票</Button>
          <Button type="link" onClick={() => message.success('手动改签流程已打开')}>手动改签</Button>
          <Dropdown menu={moreRowItems(record)} trigger={['click']}>
            <Button type="link">更多</Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  const columns = baseColumns.filter((column) => column.key === 'actions' || visibleColumnKeys.includes(column.key));
  const columnOptions = baseColumns.filter((column) => column.key !== 'actions').map((column) => ({ label: column.title, value: column.key }));
  const columnSettingContent = (
    <div className="column-setting-panel" onClick={(event) => event.stopPropagation()}>
      <div className="column-setting-title">列设置</div>
      <Checkbox.Group value={visibleColumnKeys.filter((key) => key !== 'actions')} onChange={(values) => setVisibleColumnKeys(values.concat(['actions']))}>
        <Space direction="vertical" size={8}>
          {columnOptions.map((option) => <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>)}
        </Space>
      </Checkbox.Group>
    </div>
  );

  const batchMenu = {
    items: [
      { key: 'change', label: '批量改签', icon: <SwapOutlined />, onClick: () => confirmAction('确认批量改签？', '将对已勾选订单创建批量改签任务。') },
      { key: 'refund', label: '批量退票', icon: <ReloadOutlined />, onClick: () => confirmAction('确认批量退票？', '将对已勾选订单创建批量退票审核任务。') },
      { key: 'print', label: '批量打印行程单', icon: <FileTextOutlined />, onClick: () => message.success('批量打印任务已提交') },
      { key: 'notice', label: '批量补发通知', icon: <NotificationOutlined />, onClick: () => message.success('批量通知任务已提交') },
    ],
  };

  return (
    <main className="content-scroll" data-boss-shell="content">
      <div className="orders-page">
        <OrderQueryPanel form={form} loading={loading} onQuery={doQuery} onReset={resetQuery} />
        <section className="table-module" data-boss-table-module>
          <div className="query-summary" data-boss-query-summary="card">
            {summaryStats.map((item) => (
              <div className="query-summary-card" key={item.title}>
                <Statistic title={item.title} value={item.value} precision={item.precision || 0} />
              </div>
            ))}
          </div>
          <div className="toolbar table-toolbar">
            <div className="toolbar-title">全部机票订单</div>
            <div className="toolbar-actions">
              <Button type="primary" onClick={() => message.success('订单导出任务已创建')}>批量导出订单</Button>
              <Dropdown menu={batchMenu} trigger={['click']}>
                <Button>批量操作</Button>
              </Dropdown>
              <Tooltip title="列设置">
                <Dropdown trigger={['click']} placement="bottomRight" dropdownRender={() => columnSettingContent}>
                  <Button className="column-setting-button" icon={<SettingOutlined />} />
                </Dropdown>
              </Tooltip>
            </div>
          </div>
          <div className="table-body">
            <Table
              rowKey="key"
              loading={loading}
              columns={columns}
              dataSource={orderRows}
              pagination={false}
              rowSelection={{}}
              scroll={{ x: 1360 }}
              locale={{ emptyText: <Empty description="暂无符合条件的机票订单" /> }}
            />
            <div className="table-pagination">
              <Pagination
                current={1}
                pageSize={10}
                showSizeChanger={{ getPopupContainer: () => document.body }}
                pageSizeOptions={[10, 20, 50, 100]}
                locale={{ items_per_page: '条/页', jump_to: '跳至', page: '页' }}
                total={128436}
                showTotal={(total) => `共 ${total} 条`}
              />
            </div>
          </div>
        </section>
        <footer className="footer">© 2026 易宝支付有限公司 版权所有</footer>
      </div>
      <Drawer
        title={<div className="drawer-title-bar"><span>机票订单详情</span><Button type="text" icon={<CloseOutlined />} onClick={() => setDrawerOpen(false)} /></div>}
        width={760}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        closable={false}
        footer={<Space style={{ display: 'flex', justifyContent: 'flex-end' }}><Button onClick={() => setDrawerOpen(false)}>取 消</Button><Button type="primary" onClick={() => message.success('订单处理已提交')}>确 认</Button></Space>}
      >
        <div className="drawer-section">
          <div className="drawer-section-title">订单基础信息</div>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="订单号">{selectedRow.orderNo}</Descriptions.Item>
            <Descriptions.Item label="PNR 编码">{selectedRow.pnr}</Descriptions.Item>
            <Descriptions.Item label="订单状态">{selectedRow.statusText}</Descriptions.Item>
            <Descriptions.Item label="销售渠道">{selectedRow.channel}</Descriptions.Item>
            <Descriptions.Item label="乘客信息">{selectedRow.passenger}</Descriptions.Item>
            <Descriptions.Item label="舱位">{selectedRow.cabin}</Descriptions.Item>
          </Descriptions>
        </div>
        <div className="drawer-section">
          <div className="drawer-section-title">航班与票款信息</div>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="航司航班号">{selectedRow.airline}</Descriptions.Item>
            <Descriptions.Item label="起降城市">{selectedRow.route}</Descriptions.Item>
            <Descriptions.Item label="起降时间">{selectedRow.time}</Descriptions.Item>
            <Descriptions.Item label="票价(元)">{selectedRow.fare.toLocaleString('zh-CN')}</Descriptions.Item>
            <Descriptions.Item label="税费(元)">{selectedRow.tax.toLocaleString('zh-CN')}</Descriptions.Item>
            <Descriptions.Item label="应收合计(元)">{(selectedRow.fare + selectedRow.tax).toLocaleString('zh-CN')}</Descriptions.Item>
          </Descriptions>
        </div>
      </Drawer>
    </main>
  );
}

function BossLedgerPage() {
  const initialPage = window.location.hash === '#orders' ? 'orders' : 'overview';
  const activePageState = React.useState(initialPage);
  const activePage = activePageState[0];
  const setActivePage = activePageState[1];
  const collapsedState = React.useState(false);
  const collapsed = collapsedState[0];
  const setCollapsed = collapsedState[1];
  const openKeysState = React.useState(['travel-overview', 'risk-todo']);
  const openKeys = openKeysState[0];
  const setOpenKeys = openKeysState[1];

  const activeMenuKey = activePage === 'overview' ? 'flight-dashboard' : 'all-orders';
  const currentMenuItems = activePage === 'overview' ? menuBySection.overview : menuBySection.orders;

  const handleSectionChange = (key) => {
    if (key === 'overview' || key === 'orders') {
      setActivePage(key);
      setOpenKeys(key === 'overview' ? ['travel-overview', 'risk-todo'] : ['ticket-order', 'trip-doc']);
    }
  };

  return (
    <ConfigProvider
      locale={antd.locales && antd.locales.zh_CN}
      theme={{ cssVar: true, token: { colorPrimary: '#F36046', borderRadius: 4, lineWidth: 1 } }}
    >
      <App>
        <div className="boss-page">
          <div className="topbar" data-boss-shell="topbar">
            <div>上次登录时间：2026-07-10 09:18:32　登录 IP：10.24.18.66</div>
            <div>10080090899 · Boss Ledger 航旅运营后台　帮助中心　消息　退出</div>
          </div>
          <header className="primary-nav" data-boss-shell="primary-nav">
            <div className="logo-zone">
              <img className="logo" src="../../specs/boss logo.svg" alt="老板管账 Boss Ledger" data-boss-logo-source="specs/boss logo.svg" />
            </div>
            <nav className="primary-items" aria-label="一级导航">
              {sections.map((item) => (
                <div className={`primary-item ${activePage === item.key ? 'active' : ''}`} key={item.key} onClick={() => handleSectionChange(item.key)}>
                  {item.label}
                </div>
              ))}
            </nav>
          </header>
          <div className="shell">
            <aside className={`sider ${collapsed ? 'collapsed' : ''}`} data-boss-shell="sider">
              <div className="sider-menu">
                <Menu
                  mode="inline"
                  inlineCollapsed={collapsed}
                  inlineCollapsedWidth={48}
                  selectedKeys={[activeMenuKey]}
                  openKeys={collapsed ? [] : openKeys}
                  onOpenChange={setOpenKeys}
                  items={currentMenuItems}
                />
              </div>
              <div className="sider-toggle" data-boss-sider-collapse onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </div>
            </aside>
            <section className="workspace">
              <ShellTabs activePage={activePage} setActivePage={setActivePage} />
              {activePage === 'overview' ? <DashboardContent /> : <OrderTablePage />}
            </section>
          </div>
        </div>
      </App>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BossLedgerPage />);
