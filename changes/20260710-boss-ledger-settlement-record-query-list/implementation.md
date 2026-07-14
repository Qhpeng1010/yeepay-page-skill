# Implementation: 结算记录查询列表页

## Output

- HTML preview: `changes/20260710-boss-ledger-settlement-record-query-list/preview.html`
- Runtime script: `changes/20260710-boss-ledger-settlement-record-query-list/preview-app.js`
- Local dependencies: `vendor/`
- Logo asset: `assets/boss-ledger-logo.svg`

## Implementation Notes

- 预览使用 React + Ant Design + Ant Design Icons 真实运行组件。
- 页面壳层、导航、Tabs、查询区、表格区沿用 Boss Ledger 模板。
- 查询条件共 6 个，默认全部展示；动作区固定在三列查询网格最右列。
- 轻量统计位于表格模块内部，展示统计后不再展示 `查询列表` 大标题；统计占用原标题的左侧 toolbar 位置，与右侧工具按钮在同一行。
- 表格操作列固定右侧，包含“查看详情”和“下载回单”。
- 查看详情使用 Ant Design Drawer；下载回单在预览中使用 message 反馈。

## Validation Command

```text
node yeepay-page-skill/scripts/validate-boss-ledger-preview.mjs yeepay-page-skill/changes/20260710-boss-ledger-settlement-record-query-list/preview.html
```
