const { App: AntApp, ConfigProvider, Empty } = antd;
const bossLedgerTheme = window.BossLedgerTheme;
if (!bossLedgerTheme?.antTokens) throw new Error('Boss Ledger generated theme is missing. Rebuild Director artifacts before rendering.');

const shellConfig = {
  topbar: {
    left: '上次登录时间：2026-07-15 09:18:32　登录 IP：10.24.18.66',
    right: 'Boss Ledger　帮助中心　消息'
  },
  logoSrc: './assets/boss-logo.svg',
  primaryNav: [
    { key: 'home', label: '首页', route: '/home' },
    { key: 'merchant', label: '商户管理', route: '/merchant' },
    { key: 'workspace', label: '业务管理', route: '/workspace' },
    { key: 'system', label: '系统管理', route: '/system' }
  ],
  sideMenusByPrimary: {
    home: [{ key: 'home-group', label: '首页', icon: 'HomeOutlined', children: [{ key: 'dashboard', label: '经营概览', route: '/home/dashboard' }] }],
    merchant: [{ key: 'merchant-group', label: '商户管理', icon: 'TeamOutlined', children: [{ key: 'merchant-query', label: '商户查询', route: '/merchant/query' }] }],
    workspace: [{
      key: 'business',
      label: '业务管理',
      icon: 'AppstoreOutlined',
      children: [
        { key: 'current-page', label: '当前页面', route: '/workspace/current-page', closable: false },
        { key: 'business-record', label: '业务记录', route: '/workspace/business-record' }
      ]
    }],
    system: [{ key: 'system-group', label: '系统管理', icon: 'SettingOutlined', children: [{ key: 'operator-query', label: '操作员管理', route: '/system/operator' }] }]
  },
  tabs: [
    { key: 'dashboard', label: '经营概览', route: '/home/dashboard', closable: true },
    { key: 'current-page', label: '当前页面', route: '/workspace/current-page', closable: false },
    { key: 'business-record', label: '业务记录', route: '/workspace/business-record', closable: true }
  ],
  activePrimaryKey: 'workspace',
  selectedMenuKey: 'current-page',
  openMenuKeys: ['business'],
  activeTabKey: 'current-page'
};

function renderBusinessContent({ activeTabKey }) {
  if (activeTabKey !== 'current-page') return null;
  return React.createElement('div', { className: 'boss-content-stack' },
    React.createElement('section', { className: 'boss-content-module boss-shell-demo-module' },
      React.createElement('div', { className: 'boss-shell-demo-title' }, 'Boss Ledger 固定框架层'),
      React.createElement('div', { className: 'boss-shell-demo-copy' }, '顶部信息栏、一级导航、左侧菜单、多标签和内容滚动容器均来自固定 Shell。')),
    React.createElement('section', { className: 'boss-content-module boss-shell-demo-fill' },
      React.createElement(Empty, { description: '业务内容由具体页面模板填充' })));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(ConfigProvider, {
    locale: antd.locales?.zh_CN,
    theme: {
      token: bossLedgerTheme.antTokens
    }
  }, React.createElement(AntApp, null,
    React.createElement(BossLedgerShell, { config: shellConfig, renderContent: renderBusinessContent })))
);
