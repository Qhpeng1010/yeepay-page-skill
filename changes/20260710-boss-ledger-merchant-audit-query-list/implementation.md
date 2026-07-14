# Implementation: 商户审核查询列表页

## Output

- HTML preview: `changes/20260710-boss-ledger-merchant-audit-query-list/preview.html`
- Runtime script: `changes/20260710-boss-ledger-merchant-audit-query-list/preview-app.js`
- Local dependencies: `vendor/`
- Logo asset: `assets/boss-ledger-logo.svg`

## Implementation Notes

- 预览使用 React + Ant Design + Ant Design Icons 真实运行组件。
- 页面壳层、导航、Tabs、查询区、表格区沿用 Boss Ledger 模板，不重新设计。
- 本次只替换业务字段、表格列、行内操作和 mock 数据。
- 查询字段共 6 个：商户编号、商户名称、审核状态、提交时间、审核人、资料类型；动作区固定在三列网格最右列。
- 表格字段共 8 个：商户编号、商户名称、资料类型、提交时间、审核状态、审核人、更新时间、操作。
- 表格默认每页 10 条，操作列固定右侧，包含“查看详情 / 审核 / 驳回”；非待审核记录禁用审核和驳回。
- 详情使用 Ant Design Drawer，审核处理使用 Ant Design Modal 和 Modal.confirm。
- 点击“驳回”时直接打开驳回态审核弹窗，并要求填写驳回原因。
- 为避免浏览器端 Babel 在 DOM dump 中注入 `TypeError` 等英文错误类名导致校验误报，JSX 已预编译为外部 `preview-app.js`。

## Validation Command

```text
node scripts/validate-boss-ledger-preview.mjs changes/20260710-boss-ledger-merchant-audit-query-list/preview.html
```
