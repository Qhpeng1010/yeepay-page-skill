const { App: AntApp, ConfigProvider, Steps, Form, Input, Button, Result } = antd;
const h = React.createElement;

const shellConfig = {
  topbar: { left: '上次登录时间：2026-07-15 09:18:32　登录 IP：10.24.18.66', right: '商户后台　帮助中心　消息' },
  logoSrc: './assets/boss-logo.svg',
  primaryNav: [{ key: 'product', label: '商品报备', route: '/product' }],
  sideMenusByPrimary: { product: [{ key: 'product-group', label: '商品报备', icon: 'ProfileOutlined', children: [{ key: 'wizard', label: '新增报备商品', route: '/product/wizard', closable: false }] }] },
  tabs: [{ key: 'wizard', label: '新增报备商品', route: '/product/wizard', closable: false }],
  activePrimaryKey: 'product', selectedMenuKey: 'wizard', openMenuKeys: ['product-group'], activeTabKey: 'wizard'
};

const wizardSteps = [
  { title: '基础信息', description: '填写商品与商户信息' },
  { title: '规则配置', description: '设置价格与报备规则' },
  { title: '确认提交', description: '确认信息并提交审核' }
];

function WizardTemplate() {
  const [step, setStep] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();
  const next = async () => { try { await form.validateFields(); setStep((value) => Math.min(value + 1, wizardSteps.length - 1)); } catch (error) {} };
  const stepContent = step === 0
    ? h(Form, { form, layout: 'vertical' }, h('div', { className: 'wizard-field-grid' },
      h(Form.Item, { label: '字段一', name: 'fieldOne', rules: [{ required: true, message: '请输入字段一' }] }, h(Input, { placeholder: '请输入字段一' })),
      h(Form.Item, { label: '字段二', name: 'fieldTwo', rules: [{ required: true, message: '请输入字段二' }] }, h(Input, { placeholder: '请输入字段二' })) ))
    : h('div', { className: 'wizard-placeholder' }, `第${step + 1}步业务内容`);
  return h('div', { className: 'boss-wizard-page', 'data-boss-wizard-template': 'fixed' },
    h('div', { className: 'wizard-content-frame' },
      h(Steps, { current: step, items: wizardSteps, className: 'japan-steps' }),
      h('div', { className: 'wizard-body-grid' },
        h('section', { className: 'wizard-panel wizard-form-pane' }, stepContent),
        h('aside', { className: 'wizard-guide-pane' }, h('img', { className: 'wizard-guide-image', src: './assets/wizard-guide.png', alt: '流程引导' }), h('div', { className: 'wizard-guide-title' }, '按步骤完成配置'), h('div', { className: 'wizard-guide-text' }, '请完成左侧信息后继续下一步。')))),
    h('div', { className: 'wizard-action-bar' }, h(Button, { disabled: step === 0, onClick: () => setStep((value) => value - 1) }, '上 一 步'), h(Button, { type: 'primary', loading: submitting, onClick: next }, step === wizardSteps.length - 1 ? '提 交' : '下一步'))
  );
}

function renderBusinessContent({ activeTabKey }) { return activeTabKey === 'wizard' ? h(WizardTemplate) : h(Result, { status: 'success', title: '提交成功' }); }

ReactDOM.createRoot(document.getElementById('root')).render(h(ConfigProvider, { locale: antd.locales?.zh_CN, theme: { token: { colorPrimary: '#F36046', colorLink: '#F36046', colorLinkHover: '#D94E36', borderRadius: 4 } } }, h(AntApp, null, h(BossLedgerShell, { config: shellConfig, renderContent: renderBusinessContent }))));
