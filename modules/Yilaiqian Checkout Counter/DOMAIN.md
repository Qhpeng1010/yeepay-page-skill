# Yilaiqian Checkout Counter Domain

Yilaiqian Checkout Counter（易来钱收银台）是面向移动端用户的 H5 支付业务域，承载从扫码进入收银台到支付结果反馈的完整交易体验。

## Route Boundary

- 扫码付款、金额录入、支付方式选择、优惠与分期信息、支付确认进入本模块。
- 支付处理中、支付成功、支付失败、订单关闭、浏览器异常和不可用提示进入本模块。
- 商户运营后台、审核、对账、配置、开放平台和 API/SDK 文档不进入本模块。

## Progressive Loading

当前模块使用三类 Markdown 规范：`business-rules.md` 定义业务状态与校验，`DESIGN(2).md` 定义视觉与布局，`components.md` 定义 Vue 3 + Vant 4 组件实现。进入本业务域后通过资源解析器按阶段加载，不直接扫描整个模块。

本模块采用 `markdown-direct` 实现方式：从 Markdown 规范直接生成移动端 H5 收银台页面，不复用 Boss Ledger 后台壳层。交互预览必须使用真实 Vant 组件，不得手写仿 Vant 控件。
