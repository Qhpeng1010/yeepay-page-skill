# Implementation: 客户门店查询列表页

## Output

- HTML preview: `changes/20260710-boss-ledger-customer-store-query-list/preview.html`
- Runtime script: `changes/20260710-boss-ledger-customer-store-query-list/preview-app.js`
- Local dependencies: `vendor/`
- Logo asset: `assets/boss-ledger-logo.svg`

## Implementation Notes

- 预览使用 React + Ant Design + Ant Design Icons 真实运行组件。
- 页面壳层、导航、Tabs、查询区、表格区沿用 Boss Ledger 模板，不重新设计。
- 本次只替换业务字段、表格列、行内操作和 mock 数据。
- 查询字段共 8 个，默认收起展示 5 个，动作区固定在三列网格最右列。
- 表格操作列固定右侧；“查看详情”为主操作，“编辑”为普通操作。
- 详情使用 Ant Design Drawer。
- `preview-app.js` 使用普通浏览器 JS，避免浏览器端 Babel 在 DOM dump 中注入英文错误类名导致校验误报。

## Validation Command

```text
node scripts/validate-boss-ledger-preview.mjs changes/20260710-boss-ledger-customer-store-query-list/preview.html
```
