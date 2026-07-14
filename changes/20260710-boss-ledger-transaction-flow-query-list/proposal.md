# Boss Ledger 交易流水查询列表页方案

## 原始需求

生成一个 Boss Ledger 交易流水查询列表页。

运营人员需要查询交易流水，并在列表上方查看多个核心统计指标。

## 合理假设

- 平台明确为 Boss Ledger，选择 Boss Ledger 运营后台主题。
- 页面类型明确为卡片汇总查询列表页。
- 本次输出为 HTML 预览产物，不修改生产项目源码。
- 行内“发起退款”在预览中使用轻量消息反馈，正式接入时应增加退款表单或确认流程。

## 主题选择

- Selected theme: Boss Ledger
- Theme source: `specs/themes/boss-ledger.md`
- Routing reason: 需求包含 Boss Ledger、交易流水、查询列表、运营后台统计查询场景。
- 未混用其它主题源。

## 页面目标

- 运营人员可通过商户、订单、状态、支付方式、交易时间筛选交易流水。
- 在查询结果模块顶部查看交易金额、笔数、成功金额、退款金额四项核心指标。
- 在表格中查看交易明细并执行查看详情、发起退款、下载凭证。

## 交付物

- `preview.html`
- `preview-app.js`
- `page-design.md`
- `tasks.md`
- `implementation.md`
- `review.md`
