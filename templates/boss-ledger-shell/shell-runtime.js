/* Requires React, antd, and Ant Design Icons browser globals. */
const BossLedgerShell = ({ config, children, emptyContent }) => {
  const { Menu, Tabs, Empty } = antd;
  const icons = window.icons || window.antdIcons || window.AntDesignIcons || {};
  const { BankOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ReloadOutlined, CloseOutlined } = icons;
  const [collapsed, setCollapsed] = React.useState(false);
  const [activePrimaryKey, setActivePrimaryKey] = React.useState(config.activePrimaryKey);
  const [selectedMenuKey, setSelectedMenuKey] = React.useState(config.selectedMenuKey);
  const [openMenuKeys, setOpenMenuKeys] = React.useState(config.openMenuKeys || []);
  const [activeTabKey, setActiveTabKey] = React.useState(config.activeTabKey);
  const [tabs, setTabs] = React.useState(config.tabs || []);

  const primary = config.primaryNav || [];
  const menuItems = (config.sideMenusByPrimary?.[activePrimaryKey] || []).map((item) => ({
    ...item,
    icon: item.icon && icons[item.icon] ? React.createElement(icons[item.icon]) : undefined
  }));
  const tabItems = tabs.map((tab) => ({
    key: tab.key,
    closable: tab.closable !== false,
    label: React.createElement('span', { className: 'boss-shell-tab-label' },
      activeTabKey === tab.key ? React.createElement(ReloadOutlined, { 'data-boss-tab-static-icon': true }) : null,
      React.createElement('span', { className: 'boss-shell-tab-title' }, tab.label))
  }));

  const openRoute = (key) => {
    setSelectedMenuKey(key);
    setActiveTabKey(key);
    if (!tabs.some((tab) => tab.key === key)) {
      const routeTab = (config.tabs || []).find((tab) => tab.key === key);
      if (routeTab) setTabs((current) => current.concat(routeTab));
    }
  };

  const closeTab = (key) => {
    if (tabs.length <= 1) return;
    const index = tabs.findIndex((tab) => tab.key === key);
    const next = tabs.filter((tab) => tab.key !== key);
    setTabs(next);
    if (key === activeTabKey) setActiveTabKey(next[Math.max(0, index - 1)].key);
  };

  return React.createElement('div', { className: 'boss-shell' },
    React.createElement('div', { className: 'boss-shell-topbar', 'data-boss-shell': 'topbar' },
      React.createElement('span', null, config.topbar?.left),
      React.createElement('span', null, config.topbar?.right)),
    React.createElement('header', { className: 'boss-shell-primary-nav', 'data-boss-shell': 'primary-nav' },
      React.createElement('div', { className: 'boss-shell-logo-zone' },
        React.createElement('img', { className: 'boss-shell-logo', src: config.logoSrc || '../../specs/boss logo.svg', alt: 'Boss Ledger', 'data-boss-logo-source': 'specs/boss logo.svg' })),
      React.createElement('nav', { className: 'boss-shell-primary-items' }, primary.map((item) =>
        React.createElement('div', { key: item.key, className: `boss-shell-primary-item ${item.key === activePrimaryKey ? 'active' : ''}`, onClick: () => setActivePrimaryKey(item.key) }, item.label)))),
    React.createElement('div', { className: 'boss-shell-body' },
      React.createElement('aside', { className: `boss-shell-sider ${collapsed ? 'collapsed' : ''}`, 'data-boss-shell': 'sider' },
        React.createElement(Menu, { mode: 'inline', inlineCollapsed: collapsed, selectedKeys: [selectedMenuKey], openKeys: collapsed ? [] : openMenuKeys, onOpenChange: setOpenMenuKeys, items: menuItems, onClick: ({ key }) => openRoute(key) }),
        React.createElement('div', { className: 'boss-shell-collapse', 'data-boss-sider-collapse': true, onClick: () => setCollapsed(!collapsed) }, collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined))),
      React.createElement('main', { className: 'boss-shell-workspace' },
        React.createElement('div', { className: 'boss-shell-tabs', 'data-boss-shell': 'tabs' }, React.createElement(Tabs, { type: 'editable-card', hideAdd: true, activeKey: activeTabKey, items: tabItems, onChange: setActiveTabKey, onEdit: (key) => closeTab(key) })),
        React.createElement('section', { className: 'boss-shell-content', 'data-boss-shell': 'content' }, children || React.createElement('div', { className: 'boss-shell-empty' }, emptyContent || React.createElement(Empty, { description: '当前标签暂无业务数据' })))))
  );
};
