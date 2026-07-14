# Page Design: 结算记录查询列表页

## Template Selection

- Main template: `template-04-query-list-inline-summary.md`
- Supporting template: `template-01-framework-shell.md`
- Template source files:
  - `specs/themes/boss-ledger-extractions/template-01-framework-shell.md`
  - `specs/themes/boss-ledger-extractions/template-04-query-list-inline-summary.md`
- Selection reason: 统计项只有 2 个，适合放在查询结果模块内部的 14px inline 汇总，不使用统计卡片。
- Includes query summary statistics: yes

## Business Module Order

1. Boss Ledger 固定壳层：顶部信息栏、一级导航、左侧导航、Tabs。
2. 查询条件模块：商户编号、商户名称、结算状态、结算日期、银行账户、结算批次号。
3. 查询结果模块：同一 toolbar 左侧轻量汇总统计、右侧工具按钮、Table、Pagination。
4. 详情 Drawer：结算信息、商户信息、处理信息。

## Query Summary

- 结算总金额：128,960.00 元
- 结算总笔数：286

## Table Columns

- 结算批次号
- 商户编号
- 商户名称
- 结算金额(元)，右对齐
- 结算状态，状态点 + 文本
- 结算日期
- 银行账户，脱敏展示
- 操作，固定右侧

## Row Actions

- 查看详情：主操作，打开 Drawer。
- 下载回单：普通文字操作，预览中展示下载反馈。

## States

- 已结算：成功色
- 结算中：处理中色
- 待结算：警告色
- 结算失败：错误色
- 空状态：暂无符合条件的结算记录

## Theme Relationship

页面使用 Boss Ledger 主色 `#F36046`、固定 shell、三列查询网格、表格模块内统计、Ant Design 真实组件和中文默认文案。

轻量汇总统计与 `查询列表` 大标题互斥，且占用同一个左侧 toolbar 位置；本页展示统计后不再展示结果区大标题。
