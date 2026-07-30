# Template Routing Spec

## Purpose

本文件定义通用页面选择原则。Boss Ledger 的实际选择规则、逻辑模板目录和组合边界以 `modules/boss-ledger/director-rules/02-template-application-rules.md` 为准。

## Hard Rules

- 每次生成页面前必须选择一个主页面模板。
- 主页面模板只能有一个；辅助模板只能服务于主模板，不得把多个主模板拼成一个不受控的新页面结构。
- Boss Ledger 只能选择 `rule-template-registry.json` 中由导演规则自动生成的逻辑模板。
- 选择后只读取核心 Context Pack 与所选页面族 Context Pack；不得读取历史 `modules/boss-ledger/templates/`。
- Boss Ledger 的 HTML 视觉与交互基础固定来自 `modules/boss-ledger/shell/` 和由视觉宪法生成的主题；不得从任何历史 Change 包重新选择或拼接框架层。
- 多标签栏属于固定 Shell，不属于任一业务页面模板。业务模板只提供 Tabs 下方的内容区结构。
- 一级 / 二级 / 三级导航和 Tabs 的文案、key、路由、选中 / 展开状态属于动态配置，可以随业务需求变化，但不得改变框架结构和样式契约。
- `page-design.md` 必须写明主页面模板、辅助模板、选择原因和业务模块顺序。

## Required Routing

| Page type | Boss Ledger rule template |
|---|---|
| 查询列表页 / 审核列表 / 配置列表 | `list.regular` |
| 轻量汇总查询列表页 | `list.inline-summary` |
| 卡片汇总查询列表页 | `list.card-summary` |
| Dashboard / 数据首页 / 首页 | `dashboard.overview` |
| 6 个及以下独立字段 | `form.modal-simple` |
| 7 至 10 个独立字段 | `form.drawer-simple` |
| 分组或全页表单 | `form.grouped-page` |
| 右侧说明的简单表单 | `form.guided-simple` |
| Wizard / 上传复核 / 分步流程 | `form.staged-flow` |
| Modal、Drawer 或全页只读详情 | `detail.record` |
| 流程内结果反馈 | `result.workflow` |
| 页面内空、错误、无权限状态 | `state.embedded` |

## Summary List Selection

带统计查询列表页按统计展示强度选择：

- 轻量 inline 查询统计：`list.inline-summary`
- 卡片式查询统计：`list.card-summary`

Boss Ledger 查询统计必须继续遵守导演规则：查询统计位于表格模块内部，不得拆成独立业务模块。
轻量 inline 查询统计与结果区大标题是唯一关系：选择 `list.inline-summary` 时，不得再展示 `查询列表` 大标题；统计文本必须放在原大标题同一左侧 toolbar 位置，并与右侧工具按钮同一行，只保留统计文本、右侧工具按钮、Table 和 Pagination。

`list.card-summary` 仅当统计项超过 2 个时使用；统计卡片必须位于 Result Module 内部、表格 Toolbar 上方，与 Toolbar 之间保留 8px 间距，不得与 Toolbar 操作同行；各数量卡片均按当前数量等宽分布，不得脱离 Result Module 变成独立业务模块。

## Required Output

每次生成页面时，必须在 `page-design.md` 的模板选择区记录：

- Main template
- Supporting template(s) 或流程状态
- Rule template ID
- Selection reason
- Whether the page includes query summary statistics
