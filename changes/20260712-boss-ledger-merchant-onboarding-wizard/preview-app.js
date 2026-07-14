(function () {
  const h = React.createElement;
  const {
    App,
    Button,
    ConfigProvider,
    Descriptions,
    Empty,
    Form,
    Input,
    Menu,
    Modal,
    Select,
    Steps,
    Tabs,
    message,
  } = antd;
  const {
    BankOutlined,
    CheckCircleOutlined,
    CloseOutlined,
    CreditCardOutlined,
    FileDoneOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ProfileOutlined,
    ReloadOutlined,
    SettingOutlined,
    TeamOutlined,
  } = icons;

  dayjs.locale('zh-cn');

  const stepFieldNames = [
    ['merchantName', 'merchantShortName', 'contactName', 'contactPhone', 'industry'],
    ['settlementAccount', 'bankName', 'settlementCycle', 'settlementMethod'],
  ];

  const defaultValues = {
    merchantName: '上海海栖餐饮管理有限公司',
    merchantShortName: '海栖餐饮',
    contactName: '林海鹏',
    contactPhone: '13800138000',
    industry: '餐饮服务',
    settlementAccount: '6222 8888 6612 9036',
    bankName: '招商银行上海分行',
    settlementCycle: 'T+1',
    settlementMethod: '自动结算',
  };

  const industryOptions = ['餐饮服务', '酒店住宿', '零售商超', '文旅票务', '生活服务'];
  const bankOptions = ['招商银行上海分行', '中国工商银行北京分行', '中国建设银行深圳分行', '交通银行杭州分行'];
  const cycleOptions = ['T+1', 'D+1', '周结', '月结'];
  const methodOptions = ['自动结算', '人工复核后结算', '批量结算'];

  function asOptions(values) {
    return values.map((item) => ({ label: item, value: item }));
  }

  function TabLabel(props) {
    return h('span', { className: 'tab-label', title: props.title },
      props.active ? h(ReloadOutlined, { 'data-boss-tab-static-icon': true }) : null,
      h('span', { className: 'tab-title' }, props.title)
    );
  }

  function BossShell() {
    const [collapsed, setCollapsed] = React.useState(false);
    const [openKeys, setOpenKeys] = React.useState(['merchant']);
    const [activeTab, setActiveTab] = React.useState('onboarding');
    const [form] = Form.useForm();
    const [current, setCurrent] = React.useState(0);
    const [summary, setSummary] = React.useState(defaultValues);
    const [submitting, setSubmitting] = React.useState(false);

    const menuItems = [
      {
        key: 'merchant',
        icon: h(TeamOutlined),
        label: '商户管理',
        children: [
          { key: 'onboarding', label: '商户入驻配置' },
          { key: 'merchant-list', label: '商户资料维护' },
          { key: 'merchant-audit', label: '商户资料审核' },
        ],
      },
      {
        key: 'settlement',
        icon: h(BankOutlined),
        label: '结算管理',
        children: [
          { key: 'settlement-config', label: '结算配置' },
          { key: 'settlement-record', label: '结算记录' },
        ],
      },
      {
        key: 'system',
        icon: h(SettingOutlined),
        label: '系统配置',
        children: [
          { key: 'operator', label: '操作员管理' },
        ],
      },
    ];

    const tabs = [
      { key: 'dashboard', title: '经营数据' },
      { key: 'merchant-list', title: '商户资料' },
      { key: 'onboarding', title: '商户入驻配置' },
    ];

    function syncSummary() {
      setSummary(Object.assign({}, summary, form.getFieldsValue(true)));
    }

    function goPrev() {
      syncSummary();
      setCurrent((value) => Math.max(value - 1, 0));
    }

    function goNext() {
      form.validateFields(stepFieldNames[current]).then(() => {
        syncSummary();
        setCurrent((value) => Math.min(value + 1, 2));
      }).catch(() => {
        message.warning('请先完善当前步骤必填信息');
      });
    }

    function openSubmitConfirm() {
      form.validateFields(stepFieldNames[current] || []).then(() => {
        const values = Object.assign({}, defaultValues, summary, form.getFieldsValue(true));
        const missingStep = stepFieldNames.findIndex((names) => names.some((name) => !values[name]));
        if (missingStep >= 0) {
          setCurrent(missingStep);
          message.warning('请补全基础资料和结算配置');
          return;
        }
        setSummary(values);
        setCurrent(2);
        Modal.confirm({
          title: '提交确认',
          content: '确认提交当前商户入驻配置后，系统将进入入驻审核流程。',
          okText: '确 定',
          cancelText: '关 闭',
          width: 416,
          onOk: submit,
        });
      }).catch(() => {
        message.warning('请补全基础资料和结算配置');
      });
    }

    function submit() {
      setSubmitting(true);
      return new Promise((resolve) => {
        window.setTimeout(() => {
          setSubmitting(false);
          message.success('商户入驻配置已提交');
          resolve();
        }, 700);
      });
    }

    function fieldItem(label, name, child, rules) {
      return h(Form.Item, { label, name, rules }, child);
    }

    function renderStepContent() {
      if (current === 0) {
        return h(Form, { form, layout: 'vertical', initialValues: defaultValues, requiredMark: true },
          h('div', { className: 'wizard-form-grid', 'data-boss-query-grid': '3' },
            fieldItem('商户名称', 'merchantName', h(Input, { placeholder: '请输入商户名称', allowClear: true }), [{ required: true, message: '请输入商户名称' }]),
            fieldItem('商户简称', 'merchantShortName', h(Input, { placeholder: '请输入商户简称', allowClear: true }), [{ required: true, message: '请输入商户简称' }]),
            fieldItem('联系人', 'contactName', h(Input, { placeholder: '请输入联系人', allowClear: true }), [{ required: true, message: '请输入联系人' }]),
            fieldItem('联系电话', 'contactPhone', h(Input, { placeholder: '请输入联系电话', allowClear: true }), [
              { required: true, message: '请输入联系电话' },
              { pattern: /^1\d{10}$/, message: '请输入 11 位手机号' },
            ]),
            fieldItem('所属行业', 'industry', h(Select, { placeholder: '请选择所属行业', options: asOptions(industryOptions) }), [{ required: true, message: '请选择所属行业' }])
          )
        );
      }

      if (current === 1) {
        return h(Form, { form, layout: 'vertical', initialValues: defaultValues, requiredMark: true },
          h('div', { className: 'wizard-form-grid', 'data-boss-query-grid': '3' },
            fieldItem('结算账户', 'settlementAccount', h(Input, { placeholder: '请输入结算账户', allowClear: true }), [{ required: true, message: '请输入结算账户' }]),
            fieldItem('开户银行', 'bankName', h(Select, { showSearch: true, placeholder: '请选择开户银行', options: asOptions(bankOptions) }), [{ required: true, message: '请选择开户银行' }]),
            fieldItem('结算周期', 'settlementCycle', h(Select, { placeholder: '请选择结算周期', options: asOptions(cycleOptions) }), [{ required: true, message: '请选择结算周期' }]),
            fieldItem('结算方式', 'settlementMethod', h(Select, { placeholder: '请选择结算方式', options: asOptions(methodOptions) }), [{ required: true, message: '请选择结算方式' }])
          )
        );
      }

      const values = Object.assign({}, summary, form.getFieldsValue(true));
      return h('div', { className: 'summary-block' },
        h('h2', { className: 'summary-title' }, '确认摘要'),
        h(Descriptions, { column: 2, size: 'middle' },
          h(Descriptions.Item, { label: '商户名称' }, values.merchantName),
          h(Descriptions.Item, { label: '商户简称' }, values.merchantShortName),
          h(Descriptions.Item, { label: '联系人' }, values.contactName),
          h(Descriptions.Item, { label: '联系电话' }, values.contactPhone),
          h(Descriptions.Item, { label: '所属行业' }, values.industry),
          h(Descriptions.Item, { label: '结算账户' }, values.settlementAccount),
          h(Descriptions.Item, { label: '开户银行' }, values.bankName),
          h(Descriptions.Item, { label: '结算周期' }, values.settlementCycle),
          h(Descriptions.Item, { label: '结算方式' }, values.settlementMethod),
          h(Descriptions.Item, { label: '配置状态' }, h('span', { className: 'status-dot' }, '待提交'))
        )
      );
    }

    function renderBusinessContent() {
      if (activeTab !== 'onboarding') {
        return h(React.Fragment, null,
          h('div', { className: 'empty-state' }, h(Empty, { description: '暂无业务数据' })),
          h('div', { className: 'footer' }, '© 2026 易宝支付有限公司 版权所有')
        );
      }

      return h(React.Fragment, null,
        h('section', { className: 'wizard-panel', 'data-boss-query-grid': '3' },
          h('div', { className: 'wizard-steps' },
            h(Steps, {
              current,
              items: [
                { title: '填写基础资料', description: '录入商户主体和联系人信息' },
                { title: '配置结算信息', description: '确认账户、银行和结算规则' },
                { title: '确认提交', description: '核对摘要并提交入驻配置' },
              ],
            })
          ),
          h('div', { className: 'wizard-content' },
            h('div', null, renderStepContent()),
            current < 2 ? h('aside', { className: 'wizard-aside' },
              h('div', { className: 'aside-visual' },
                h('div', { className: 'aside-title' }, '入驻配置核对项'),
                h('div', { className: 'aside-row' }, h(ProfileOutlined), '基础资料完整可识别'),
                h('div', { className: 'aside-row' }, h(CreditCardOutlined), '结算账户与开户银行一致'),
                h('div', { className: 'aside-row' }, h(FileDoneOutlined), '提交前展示最终摘要'),
                h('div', { className: 'aside-row' }, h(CheckCircleOutlined), '配置提交后进入审核流')
              )
            ) : null
          )
        ),
        h('div', { className: 'footer' }, '© 2026 易宝支付有限公司 版权所有')
      );
    }

    return h('div', { className: `boss-page ${collapsed ? 'sider-collapsed' : ''}` },
      h('header', { className: 'topbar', 'data-boss-shell': 'topbar' },
        h('span', null, '上次登录时间：2026-07-12 09:42:18　登录 IP：10.24.18.66'),
        h('span', null, '当前登录：运营专员 王敏　消息中心　帮助中心　退出')
      ),
      h('nav', { className: 'primary-nav', 'data-boss-shell': 'primary-nav' },
        h('div', { className: 'logo-zone' },
          h('img', { className: 'logo', src: '../../specs/boss logo.svg', alt: 'Boss Ledger logo', 'data-boss-logo-source': 'specs/boss logo.svg' })
        ),
        h('div', { className: 'primary-items' }, ['首页', '数据报表', '商户管理', '资金管理', '结算管理', '系统配置'].map((item) =>
          h('span', { key: item, className: `primary-item ${item === '商户管理' ? 'active' : ''}` }, item)
        ))
      ),
      h('div', { className: 'shell' },
        h('aside', { className: `sider ${collapsed ? 'collapsed' : ''}`, 'data-boss-shell': 'sider' },
          h('div', { className: 'sider-menu' },
            h(Menu, {
              mode: 'inline',
              selectedKeys: ['onboarding'],
              openKeys: collapsed ? [] : openKeys,
              onOpenChange: setOpenKeys,
              inlineCollapsed: collapsed,
              items: menuItems,
            })
          ),
          h('div', {
            className: 'collapse-control',
            'data-boss-sider-collapse': 'justify-content: flex-start; text-align: left',
            onClick: () => setCollapsed(!collapsed),
          }, collapsed ? h(MenuUnfoldOutlined) : h(MenuFoldOutlined))
        ),
        h('main', { className: 'workspace' },
          h('div', { className: 'work-body' },
            h('div', { className: 'tab-strip', 'data-boss-shell': 'tabs' },
              h(Tabs, {
                className: 'boss-tabs',
                type: 'editable-card',
                hideAdd: true,
                activeKey: activeTab,
                onChange: setActiveTab,
                onEdit: () => {},
                items: tabs.map((tab) => ({
                  key: tab.key,
                  label: h(TabLabel, { active: activeTab === tab.key, title: tab.title }),
                  closeIcon: tab.key === 'dashboard' ? null : h(CloseOutlined),
                })),
              })
            ),
            h('div', { className: 'content', 'data-boss-shell': 'content' }, renderBusinessContent())
          )
        )
      ),
      activeTab === 'onboarding' ? h('div', { className: 'footer-actions query-actions', 'data-boss-query-actions': true },
        h(Button, { disabled: current === 0, onClick: goPrev }, '上一步'),
        h(Button, { disabled: current === 2, type: current < 2 ? 'primary' : 'default', onClick: goNext }, '下一步'),
        h(Button, { type: 'primary', loading: submitting, onClick: openSubmitConfirm }, '提 交')
      ) : null
    );
  }

  function Root() {
    return h(ConfigProvider, {
      theme: {
        cssVar: true,
        token: {
          colorPrimary: '#F36046',
          colorPrimaryHover: '#FF7A66',
          colorPrimaryActive: '#D94B35',
          borderRadius: 4,
          lineWidth: 1,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
        },
        components: {
          Button: { borderRadius: 4, fontWeight: 400 },
          Input: { borderRadius: 4 },
          Select: { borderRadius: 4 },
          Modal: { borderRadiusLG: 6 },
        },
      },
    }, h(App, null, h(BossShell)));
  }

  ReactDOM.render(h(Root), document.getElementById('root'));
})();
